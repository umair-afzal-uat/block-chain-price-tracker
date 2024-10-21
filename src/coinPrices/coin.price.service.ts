import { Injectable, Logger } from '@nestjs/common';
import Moralis from 'moralis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Price } from '../entites/coin.price.entity';
import * as mailgun from 'mailgun-js';
import { Alert } from 'src/entites/alert.entity';
import { SetAlertDto } from 'src/dto/alert.dto';
@Injectable()
export class CoinPriceService {
  private readonly logger = new Logger(CoinPriceService.name);
  private mg;
  constructor(@InjectRepository(Price)
  private priceRepository: Repository<Price>, @InjectRepository(Alert)
  private alertRepository: Repository<Alert>) {

    Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,     });

    this.mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });
  }

  async getTokenPrice(chain: string, address: string): Promise<any> {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        "chain": chain,
        "address": address
      });
      return response;
    } catch (error) {
      this.logger.error(`Failed to get token price: ${error.message}`);
      throw new Error('Failed to fetch token price');
    }
  }

  async getEthereumPrice(): Promise<number> {
    return this.getTokenPrice("0x1", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
  }

  async getPolygonPrice(): Promise<number> {
    return this.getTokenPrice("0x89", "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270");
  }

  async savePrice(etherumPrice: number, polyogonPrice: number): Promise<Price> {
    try {
      const price = this.priceRepository.create({ etherumPrice, polyogonPrice });
      return this.priceRepository.save(price);      
    } catch (error) {
      return error;
    }

  }

  async sendEmail(to: string, subject: string, text: string): Promise<any> {
    const data = {
      from:"testuser@gmail.com",
      to,
      subject,
      text,
    };

    return new Promise((resolve, reject) => {
      this.mg.messages().send(data, (error, body) => {
        if (error) {
          reject(error);
        }
        resolve(body);
      });
    });
  }

  async findHourlyPrices(): Promise<{ etherumPrice: string; polyogonPrice: string; createdAt: string }[]> {
    const results = await this.priceRepository
      .createQueryBuilder('price')
      .select('DATE_TRUNC(\'hour\', price.createdAt) AS hour') 
      .addSelect('AVG(price.etherumPrice) AS eth') 
      .addSelect('AVG(price.polyogonPrice) AS poly') 
      .where('price.createdAt >= NOW() - INTERVAL \'24 HOURS\'') 
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();

    return results;
  }

  async createAlert(alertData: SetAlertDto):Promise<Alert>{
    try {
      const alert = this.alertRepository.create(alertData);
      return this.alertRepository.save(alert);
    } catch (error) {
      return error;
    }
  }

  async sendAlertNotification(chainType:string,alertValue:number ){

    try {
      
      const alerts = await this.alertRepository.find({where:{alertValue,chainType}});
      for (const alert of alerts) {
        this.sendEmail(alert.email, "Price Change Alert", `${chainType} coin value has reached to ${alertValue}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async calculateEthToBtcSwap(ethAmount: number): Promise<any> {
    const feePercentage = 0.03; 
  
    try {

      const ethPriceData = await this.getTokenPrice("0x1", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
  
      const btcPriceData = await this.getTokenPrice("0x1", "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599");

  
      const ethPrice = ethPriceData.raw.usdPrice;
      const btcPrice = btcPriceData.raw.usdPrice;
  
      const ethInUsd = ethAmount * ethPrice;
      const btcAmount = ethInUsd / btcPrice;
  
      const feeEth = ethAmount * feePercentage;
      const feeUsd = feeEth * ethPrice;
  
      return {
        btcAmount, 
        fee: {
          eth: feeEth,
          usd: feeUsd,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch token prices: ${error.message}`);
    }
  }

  async getPriceOneHourAgo(): Promise<Price | null> {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1); 


    const prices = await this.priceRepository.find({
      where: {
        createdAt: LessThanOrEqual(oneHourAgo), 
      },
      order: {
        createdAt: 'DESC',
      },
      take: 1,
    });

    return prices.length > 0 ? prices[0] : null;
  }

  async checkPriceAndSendAlert(ethPrice:number,polyPrice:number) {
    const priceOneHourAgo = await this.getPriceOneHourAgo(); 
  
    if (priceOneHourAgo) {
      const ethPriceDifference = ((ethPrice - priceOneHourAgo.etherumPrice) / priceOneHourAgo.etherumPrice) * 100;
      const polyPriceDifference = ((polyPrice - priceOneHourAgo.polyogonPrice) / priceOneHourAgo.polyogonPrice) * 100;
      if (ethPriceDifference > 3) {
        await this.sendEmail("hyperhire_assignment@hyperhire.in", "Price Change Alert Etherum", "Etherum coin price increased to 3 percent");
      } 

      if (polyPriceDifference > 3) {
        await this.sendEmail("hyperhire_assignment@hyperhire.in", "Price Change Alert Polygon", "Polygon coin price increased to 3 percent");
      }
    }
  }
  

}
