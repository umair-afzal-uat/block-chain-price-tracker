import { Controller, Get, Post, Body } from '@nestjs/common';
import { CoinPriceService } from './coin.price.service';
import { Alert } from 'src/entites/alert.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SetAlertDto } from 'src/dto/alert.dto';
@Controller('prices')
@ApiTags('Price Monitoring')
export class CoinPriceController {
  constructor(private readonly coinPriceService: CoinPriceService) { }

  @Post('createAlert')
  @ApiOperation({ summary: 'Set a price alert for a specific chain and price' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chainType: { type: 'string', example: 'etherum', description: 'Blockchain identifier (e.g., etherum for Ethereum , polygon for Polygon)' },
        alertValue: { type: 'number', example: 1000, description: 'Target price for the alert in dollars' },
        email: { type: 'string', example: 'user@example.com', description: 'Email address for notifications' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Alert has been successfully set' })
  async createAlert(
    @Body() alertData: SetAlertDto): Promise<Alert> {
    return this.coinPriceService.createAlert(alertData);
  }



  @Get('hourly')
  @ApiOperation({ summary: 'Get Ethereum and Polygon prices from one hour ago' })
  @ApiResponse({ status: 200, description: 'Returns the price from one hour ago' })
  async findAll() {
    return this.coinPriceService.findHourlyPrices();
  }

  @Post('eth-to-btc')
  @ApiOperation({ summary: 'Get Swap Rate Eth to Btc' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ethAmount: { type: 'number', example: 1000, description: 'Target price for the etherum' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the swapped Bitcoin amount and the fees.',
    schema: {
      type: 'object',
      properties: {
        btcAmount: { type: 'number', example: 0.03, description: 'The amount of Bitcoin you will get' },
        feeEth: { type: 'number', example: 0.0045, description: 'Fee in Ethereum (0.03% of ethAmount)' },
        feeDollar: { type: 'number', example: 5, description: 'Fee in USD (based on current ETH price)' },
      },
    },
  })  async swapEthToBtc(@Body('ethAmount') ethAmount: number) {
    const result = await this.coinPriceService.calculateEthToBtcSwap(ethAmount);
    return result;
  }
}
