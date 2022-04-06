import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { XrayTable } from './custom/xray-table';
import { XrayTopic } from './custom/xray-topic';

export class AwsXrayStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const table = new XrayTable(this, 'XrayTable');
    const topic = new XrayTopic(this, 'XrayTopic', {
      topicName: 'xray-topic',
      displayName: 'xray-topic',
    });
  }
}
