import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBClient, PutItemCommand, PutItemCommandInput, 
  ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const logger = new Logger({
  serviceName: 'serverlessAirline',
})

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

export const handler = async(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  logger.addContext(context);

  logger.info('This is a INFO log');

  if (event.body === null) {
    return {
      statusCode: 500,
      body: '',
    }
  }
  const item = JSON.parse(event.body);

  const input: PutItemCommandInput = {
    ConditionExpression: 'attribute_not_exists(pk)',
    TableName: process.env.TABLE_NAME,
    Item: marshall(item),
  };

  try {
    const result = await dynamoDBClient.send(new PutItemCommand(input));
    console.log(JSON.stringify(result));
  } catch (e) {
    logger.error(JSON.stringify(e));
    if (e instanceof ConditionalCheckFailedException) {
      return {
        statusCode: e.$metadata.httpStatusCode ?? 500,
        body: e.name,
      }
    }
  }

  return {
    body: 'Item inserido',
    statusCode: 200,
  };
}