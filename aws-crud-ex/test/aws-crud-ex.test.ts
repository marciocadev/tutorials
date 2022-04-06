import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { AwsCrudExStack } from "../lib/aws-crud-ex-stack";

describe('Crud Stack', () => {
  let app: App, stack: Stack, template: Template

  beforeAll(() => {
    // GIVEN
    app = new App();
    stack = new AwsCrudExStack(app, 'MyTestStack');
    // WHEN
    template = Template.fromStack(stack);
  });

  test('Table name is crud-table', () => {
    // THEN
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'crud-table',
    });
  });

  test('Partition key name is pk', () => {
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

  test('Partition key type is string', () => {
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