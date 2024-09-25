import { Module } from '@nestjs/common';
import { ItunesController } from './itunes/itunes.controller';
import { ItunesService } from './itunes/itunes.service';

@Module({
  imports: [],
  controllers: [ItunesController],
  providers: [ItunesService],
})
export class AppModule {}