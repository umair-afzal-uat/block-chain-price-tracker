import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CoinPriceController } from './coinPrices/coin.price.controller';
import { CoinPriceService } from './coinPrices/coin.price.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entites/coin.price.entity';
import { Alert } from './entites/alert.entity';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, // Add these environment variables
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Price, Alert],
      synchronize: true, // Note: Set to false in production
    }),
    TypeOrmModule.forFeature([Price,Alert]),
  ],
  controllers: [AppController, CoinPriceController],
  providers: [AppService, CoinPriceService],
})
export class AppModule {}
