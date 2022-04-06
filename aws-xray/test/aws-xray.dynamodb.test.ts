import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { XrayTable } from '../lib/custom/xray-table';

describe('DynamoDB', () => {
  let table: ITable, stack: Stack, template: Template

  beforeAll(() => {
    // GIVEN
    stack = new Stack();
    table = new XrayTable(stack, 'my-test-table');
    // WHEN
    template = Template.fromStack(stack);
  });
  
  test('Table name', () => {
    // THEN
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'xray-table',
    });
  });

  test('Table partition key', () => {
    // THEN
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      KeySchema: [
        {
          AttributeName: 'pk',
          KeyType: 'HASH',
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'pk',
          AttributeType: 'S',
        }
      ],
    });
  });

  test('Table billing mode', () => {
    // THEN
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      BillingMode: 'PAY_PER_REQUEST',
    });
  });
});