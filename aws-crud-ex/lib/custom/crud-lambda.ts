import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export class CrudLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: NodejsFunctionProps) {
    super(scope, id, {
      ...props,
      logRetention: props.logRetention ?? RetentionDays.ONE_DAY,
      tracing: props.tracing ?? Tracing.ACTIVE,
      runtime: Runtime.NODEJS_14_X,
      bundling: {
        minify: true,
      }
    })
  }
}