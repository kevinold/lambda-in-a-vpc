import {
  CfnOutput,
  Duration,
  Stack,
  StackProps,
  aws_ec2 as ec2,
  aws_lambda as lambda,
} from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path = require("path");

export class LambdaInAVpcStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "LambdaVpc", {
      subnetConfiguration: [
        {
          name: "Isolated",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
        {
          name: "Private",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          name: "Public",
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // Create a security group to be used on the lambda functions
    const lambdaSecurityGroup = new ec2.SecurityGroup(
      this,
      "Lambda Security Group",
      {
        vpc,
      }
    );

    const getDataLambda: NodejsFunction = new NodejsFunction(
      this,
      id + "-getDataLambda",
      {
        memorySize: 1024,
        timeout: Duration.seconds(5),
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: "handler",
        entry: path.join(__dirname, "../lambda/getData.ts"),
        vpc: vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        securityGroups: [lambdaSecurityGroup],
        environment: {
          // PGHOST: rdsProxy.endpoint,
          // PGDATABASE: dbName,
          // PGUSER: dbUsername
        },
      }
    );

    new CfnOutput(this, "getDataLambdaArn", {
      value: getDataLambda.functionArn,
      exportName: "getDataLambdaArn",
    });
  }
}
