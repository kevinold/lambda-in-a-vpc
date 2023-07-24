#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaInAVpcStack } from '../lib/lambda-in-a-vpc-stack';

const app = new cdk.App();
new LambdaInAVpcStack(app, 'LambdaInAVpcStack');
