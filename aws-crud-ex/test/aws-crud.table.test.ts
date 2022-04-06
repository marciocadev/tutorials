import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { AttributeType, ITable } from "aws-cdk-lib/aws-dynamodb";
import { CrudTable } from "../lib/custom/crud-table";

describe('Table', () => {
  let table: ITable, stack: Stack, template: Template

  beforeAll(() => {
    // GIVEN
    stack = new Stack();
    table = new CrudTable(stack, 'MyTestTable', {
      tableName: 'test-table',
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
    });
    // WHEN
    template = Template.fromStack(stack);
  });

  test('Table name', () => {
    // THEN
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'test-table',
    });
  });

  test('Partition key name', () => {
    // THEN
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      KeySchema: [
        {
          AttributeName: 'pk',
          KeyType: 'HASH',
        },
      ],
    });
  });

  test('Partition key type', () => {
    // THEN
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      AttributeDefinitions: [
        {
          AttributeName: 'pk',
          AttributeType: 'S',
        },
      ],
    });
  });

  test('Billing mode is pay per request', () => {
    // THEN
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      BillingMode: 'PAY_PER_REQUEST',
    });
  });
});