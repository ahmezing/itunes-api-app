import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as serverlessHttp from 'serverless-http';
import * as dotenv from 'dotenv';

dotenv.config();

let lambdaApp: any;

async function bootstrap() {
  if (!lambdaApp) {
    console.log("Initializing NestJS application");
    const app = await NestFactory.create(
      AppModule,
      new FastifyAdapter({ logger: true }),
    );

    await app.init();
    lambdaApp = serverlessHttp(app.getHttpAdapter().getInstance());
    console.log("NestJS application initialized");
  }

  return lambdaApp;
}

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    console.log("Lambda function invoked with event:", JSON.stringify(event, null, 2));
    const app = await bootstrap();
    const response = await app(event, context);
    console.log("Lambda function execution completed successfully");
    return response;
  } catch (error) {
    console.error('Error in Lambda handler:', JSON.stringify(error, null, 2));
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
    };
  }
};

// Local main function to run the server locally
async function main() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  await app.listen(3002, '0.0.0.0');
  console.log('App is running on: http://localhost:3002');
}

if (process.env.IS_LOCAL) {
  main();
}