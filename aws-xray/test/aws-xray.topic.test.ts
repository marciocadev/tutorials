import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ITopic } from "aws-cdk-lib/aws-sns";
import { XrayTopic } from "../lib/custom/xray-topic";

describe('Topic', () => {
  let topic: ITopic, stack: Stack, template: Template

  beforeAll(() => {
    // GIVEN
    stack = new Stack();
    topic = new XrayTopic(stack, 'MyTopic', {
      displayName: 'my-test-topic',
      topicName: 'my-test-topic',
    });
    // WHEN
    template = Template.fromStack(stack);
  });

  test('Topic name', () => {
    // THEN
    template.hasResourceProperties('AWS::SNS::Topic', {
      TopicName: 'my-test-topic',
    });
  });

  test('Display name', () => {
    // THEN
    template.hasResourceProperties('AWS::SNS::Topic', {
      DisplayName: 'my-test-topic',
    });
  });
});