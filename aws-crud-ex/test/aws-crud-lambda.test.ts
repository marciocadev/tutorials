import { DynamoDBClient, PutItemCommand, ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../lib/lambda-fns/index'

// jest.mock('@aws-sdk/client-dynamodb', () => {
//   const client = jest.fn().mockImplementation(() => {
//     return {
//       send: jest.fn().mockImplementation(() => {
//         Promise.resolve(true)
//       })
//     };
//   });
//   return {
//     DynamoDBClient: client,
//     PutItemCommand: jest.fn(),
//   };
// });

describe('Lambda', () => {
  const OLD_ENV = process.env;
  const dynamoDBMock = mockClient(DynamoDBClient);

  beforeAll(() => {
    process.env = {
      TABLE_NAME: 'crud-table',
      ...OLD_ENV,
    };    
  });

  beforeEach(() => {
    dynamoDBMock.reset();
  });

  test('', async () => {
    dynamoDBMock.on(PutItemCommand).rejects()
  });

  test('insert item', async () => {
    dynamoDBMock.on(PutItemCommand).resolves({});

    const event: APIGatewayProxyEvent = {
      body:  JSON.stringify({
        pk: '123',
        nome: 'Marcio',
      }),
    } as any;
    const context: Context = {} as any;

    const result = await handler(event, context);

    expect(result).toMatchObject({
      body: 'Item inserido',
      statusCode: 200,
    })

    expect(dynamoDBMock.call(0).args[0].input).toEqual({
      Item: {
        nome: { S: "Marcio" },
        pk: { S: "123" },
      },
      TableName: 'crud-table',
    });
  });
});