import { ApiProperty } from '@nestjs/swagger';

export class SetAlertDto {
  @ApiProperty({ example: 'eth', description: 'Blockchain identifier (e.g., eth for Ethereum)' })
  chainType: string;

  @ApiProperty({ example: 1000, description: 'Target price for the alert in dollars' })
  alertValue: number;

  @ApiProperty({ example: 'user@example.com', description: 'Email address to send the alert' })
  email: string;
}


export class EtherumSwap {
  @ApiProperty({ example: 1000, description: 'Target price for the Etherum' })
  alertValue: number;
}