# iTunes API App

## Overview
The iTunes API App is a backend service built with Nest.js. It allows for querying the iTunes Search API and storing the results in DynamoDB. The app integrates with AWS services for serverless execution and DynamoDB for data storage.

## Features
- **Search iTunes**: Users can search the iTunes API by specifying a search term and optional filters (e.g., media type, country).
- **Store Results**: The search results are automatically stored in a DynamoDB table.
- **Retrieve Results**: Searched results will immediatly be back in the response.
 
## Key Notes

- The Production endpoint is provided in the explination document sent to the team.
- Kindly, do not abuse the provided endpoint as it only has limit of 150 items, exceeding that will hurt my wallet :).

## Technologies
- Nest.js
- TypeScript
- AWS (Lambda, DynamoDB, API Gateway, IAM, CloudWatch)
- iTunes Search API

## Getting Started

### Prerequisites
- **Node.js** (v20+)
- **npm** (v8+)
- **AWS CLI**: The AWS Command Line Interface must be installed and configured with an AWS account. This project utilizes AWS services like Lambda and DynamoDB, so having the AWS CLI configured is essential.
    - If you haven't already, create an AWS account and an IAM user with the required permissions. Then, configure the AWS CLI with the credentials of this IAM user. Follow the official AWS guide for [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).
- **Nest CLI**: Install the Nest.js CLI globally:
    ```bash
    npm install -g @nestjs/cli
    ```

- **Serverless Framework**: Install the Serverless Framework globally:
    ```bash
    npm install -g serverless
    ```

### Installation
1. **Clone the Repository**
    ```bash
    git clone https://github.com/ahmezing/itunes-api-app
    cd itunes-api-app
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **DynamoDB Setup**
    - You need to create a DynamoDB table in your AWS account to store the iTunes results.
    - Use the AWS Management Console or AWS CLI to create a table. Here’s a simple CLI command to create a table:
      ```bash
      aws dynamodb create-table \
        --table-name ItunesResults \
        --attribute-definitions AttributeName=id,AttributeType=S \
        --key-schema AttributeName=id,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST
      ```
    - **Note**: Ensure the IAM user configured in your AWS CLI has permissions to create and access DynamoDB tables. This typically involves having the `AmazonDynamoDBFullAccess` policy attached to your IAM user or role.

4. **Environment Variables**
    - Create a `.env` file based on the `.env.example` file provided in the repository.
    - Set up the required environment variables:
      - `AWS_REGION_CODE`
      - `IS_LOCAL`
      - `AWS_ACCOUNT_ID`
    - Ensure these match the configuration in your AWS environment.

### Building and Running

1. **Build the Project**
    - Run the following command to build the project:
      ```bash
      npm run build
      ```

2. **Running Locally**
    - To run the application locally, use the following command:
      ```bash
      npm run start:dev
      ```

### Deployment

1. **Configure the Serverless Framework**
    - Update `serverless.yml` with your AWS configurations. This includes specifying your service name, provider details (like `region` and `runtime`), functions, events, and any resources your application needs.
    - **IAM Role**: Ensure the IAM role defined in `serverless.yml` has the necessary permissions for the services your application uses. This typically involves permissions for Lambda to access DynamoDB and invoke API Gateway.
    - **Environment Variables**: Define any required environment variables in `serverless.yml` under the `provider` section. This includes variables like `AWS_ACCOUNT_ID` and `AWS_REGION_CODE`.

2. **Deploy**
    - Run the following command to deploy the service to AWS Lambda:
      ```bash
      serverless deploy
      ```

    - **Note**: You must run `npm run build` before deploying. If you make any changes to the code and want to redeploy, you need to run `npm run build` again before executing the deploy command.

3. **API Gateway Notes**
    - In production, the request must **NOT** contain a body when invoking the Lambda function via API Gateway. Be sure to test this behavior in your API requests.

### API Endpoint

- **Search iTunes**: `GET /search`
  - Query Parameters:
    - **term** (required): The search term (e.g., `jack+johnson`).
    - **country** (optional): The two-letter country code for the iTunes store (e.g., `US`).
    - **media** (optional): The media type to search for (e.g., `movie`, `podcast`, `music`, `audiobook`, `tvShow`, etc.). Default is `all`.
    - **entity** (optional): The type of results relative to the media type (e.g., `musicArtist`, `album`, `podcastAuthor`, etc.).
    - **attribute** (optional): The attribute to search for (e.g., `artistTerm`, `albumTerm`, `songTerm`, `titleTerm`, etc.).
    - **limit** (optional): The number of results to return (e.g., `25`). Default is `50`.
    - **lang** (optional): The language to use for the search results (e.g., `en_us`, `ja_jp`). Default is `en_us`.
    - **version** (optional): The search result key version (`1`, `2`). Default is `2`.
    - **explicit** (optional): Flag to include explicit content (`Yes`, `No`). Default is `Yes`.


  - Example Request:
     ```bash
     GET /search?term=jack+johnson&country=US&media=music&entity=album&limit=10&explicit=No
     ```

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/ahmezing/itunes-api-app/blob/main/LICENSE) file for details.
