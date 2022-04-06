import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AwsXrayStack } from '../lib/aws-xray-stack';

describe('DynamoDB', () => {
  let app: App, stack: Stack, template: Template

  beforeAll(() => {
    // GIVEN
    app = new App();
    stack = new AwsXrayStack(app, 'MyTestStack');
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