import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { ItunesSearchDto } from './dto/itunes-search.dto';
import axios, { AxiosError } from 'axios';
import { dynamoDbClient } from '../config/aws.config';

@Injectable()
export class ItunesService {
  private dynamoDb: DynamoDBDocumentClient;

  constructor() {
    this.dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);
  }

  async searchItunes(itunesSearchDto: ItunesSearchDto) {
    try {
      const searchParams = this.buildSearchParams(itunesSearchDto);
      const response = await axios.get('https://itunes.apple.com/search', { params: searchParams });
      const results = response.data;

      await this.storeResults(results);
      return results;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new InternalServerErrorException(`Error fetching data from iTunes API: ${error.message}`);
      } else {
        throw new InternalServerErrorException(`An unexpected error occurred: ${error.message}`);
      }
    }
  }

  private buildSearchParams(itunesSearchDto: ItunesSearchDto): Record<string, any> {
    const { term, country, media, entity, attribute, limit, lang, version, explicit } = itunesSearchDto;
    return {
      term,
      country,
      media,
      entity,
      attribute,
      limit,
      lang,
      version,
      explicit,
    };
  }

  private async storeResults(results: any) {
    try {
      for (const item of results.results) {
        const params = {
          TableName: 'ItunesResults',
          Item: item,
        };
        await this.dynamoDb.send(new PutCommand(params));
      }
    } catch (error) {
      console.error('Full error object:', JSON.stringify(error, null, 2));
      if (error instanceof Error) {
        throw new InternalServerErrorException(`Error storing results in DynamoDB: ${error.message}`);
      } else {
        throw new InternalServerErrorException('An unknown error occurred while storing results in DynamoDB');
      }
    }
  }
}