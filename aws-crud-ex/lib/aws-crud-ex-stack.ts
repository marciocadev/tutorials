import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { join } from 'path';
import { CrudLambda } from './custom/crud-lambda';
import { CrudTable } from './custom/crud-table';

export class AwsCrudExStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new CrudTable(this, 'CrudTable', {
      partitionKey: {
        name: "pk",
        type: AttributeType.STRING,
      },
      tableName: 'crud-table',
    });

    const lambda = new CrudLambda(this, 'CrudLambda', {
      functionName: 'crud-ambda',
      handler: 'handler',
      entry: join(__dirname, 'lambda-fns/index.ts'),
      environment: {
        TABLE_NAME: table.tableName,
      }
    });
    table.grantWriteData(lambda);

    const integration = new LambdaIntegration(lambda);

    const gtw = new RestApi(this, 'CrudGtw');

    gtw.root.addMethod('POST', integration);
  }
}
