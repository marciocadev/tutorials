import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table, TableProps } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class XrayTable extends Table {
  constructor(scope: Construct, id: string, props?: TableProps) {
    super(scope, id, {
      ...props,
      tableName: 'xray-table',
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}