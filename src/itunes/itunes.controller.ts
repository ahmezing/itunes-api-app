import { Controller, Get, Query } from '@nestjs/common';
import { ItunesService } from './itunes.service';
import { ItunesSearchDto } from './dto/itunes-search.dto';

@Controller('itunes')
export class ItunesController {
  constructor(private readonly itunesService: ItunesService) {}

  @Get('search')
  async searchItunes(@Query() itunesSearchDto: ItunesSearchDto) {
    const results = await this.itunesService.searchItunes(itunesSearchDto);
    return results;
  }
}