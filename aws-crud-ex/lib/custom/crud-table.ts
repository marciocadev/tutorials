import { BillingMode, Table, TableProps } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class CrudTable extends Table {
  constructor(scope: Construct, id: string, props: TableProps) {
    super(scope, id, {
      billingMode: props.billingMode ?? BillingMode.PAY_PER_REQUEST,
      ...props,
    });
  }
}