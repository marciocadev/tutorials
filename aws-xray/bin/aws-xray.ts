#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsXrayStack } from '../lib/aws-xray-stack';

const app = new cdk.App();
new AwsXrayStack(app, 'AwsXrayStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
});