import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CoinPriceService } from './coinPrices/coin.price.service';
@Injectable()
export class AppService {
  constructor(private readonly coinPriceService: CoinPriceService) { }

  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!';
  }



  @Cron('*/5 * * * *')
  async handleCron() {
    try {
      const ethPrice: any = await this.coinPriceService.getEthereumPrice();
      const maticPrice: any = await this.coinPriceService.getPolygonPrice();
      await this.coinPriceService.savePrice(ethPrice.jsonResponse.usdPrice, maticPrice.jsonResponse.usdPrice);

      await this.coinPriceService.sendAlertNotification('etherum', (ethPrice.jsonResponse.usdPrice).toFixed(2));
      await this.coinPriceService.sendAlertNotification('polygon', (maticPrice.jsonResponse.usdPrice).toFixed(2));
      await this.coinPriceService.checkPriceAndSendAlert((ethPrice.jsonResponse.usdPrice).toFixed(2), (maticPrice.jsonResponse.usdPrice).toFixed(2));
      console.log("Cron CAlllll", (ethPrice.jsonResponse.usdPrice).toFixed(2), (maticPrice.jsonResponse.usdPrice).toFixed(2)
      )

    } catch (error) {
      this.logger.debug('Error', error);
    }

  }

}
