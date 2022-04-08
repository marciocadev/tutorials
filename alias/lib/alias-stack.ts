import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AwsIntegration, Deployment, Method, RestApi, Stage } from 'aws-cdk-lib/aws-apigateway';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Alias, Version } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export class AliasStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambda = new NodejsFunction(this, 'NodejsLambdaAlias', {
      functionName: 'alias',
      entry: join(__dirname, './lambda-fns/index.ts'),
      handler: 'handler',
      bundling: { minify: true },
      currentVersionOptions: {
        removalPolicy: RemovalPolicy.RETAIN,
      }
    });

    const rest = new RestApi(this, 'RestApiAlias', {
      restApiName: 'alias',
      deploy: false,
      retainDeployments: false,
    });
    const integration = new AwsIntegration({
      proxy: true,
      service: 'lambda',
      path: `2015-03-31/functions/${lambda.functionArn}` + ':${stageVariables.lambdaAlias}/invocations',
    });
    const method = rest.root.addMethod('GET', integration);

    this.magicHappensHere('Dev', lambda, rest, method);

    // Para criar a versão de produção indique qual a versão estável
    const prodVersion = 38;
    this.magicHappensHere('Prod', lambda, rest, method, prodVersion);
  }

  /**
   * Cria o alias de acordo com a versão, o alias de dev deve ser sempre o da versão corrente.
   * Cria um deployment e um stage vinculado ao alias pela variável 'lambdaAlias'
   * Cria a permissão para que o alias possa ser vinculado ao método
   */
  magicHappensHere(id: string, lmb: NodejsFunction, rest: RestApi, method: Method, version?: number) {
    const lmbVersion = (version === undefined) 
      ? lmb.currentVersion 
      : Version.fromVersionArn(this, id.concat('Version'), `${lmb.functionArn}:${version.toString()}`);
    const alias = new Alias(this, id.concat('Alias'), {
      aliasName: id.toLowerCase(),
      version: lmbVersion,
    });
    const deployment = new Deployment(this, id.concat('Deployment'), {
      api: rest,
      retainDeployments: false,
    });
    const stage = new Stage(this, id.concat('Stage'), {
      deployment: deployment,
      stageName: id.toLowerCase(),
      variables: {
        lambdaAlias: id.toLowerCase(),
      },
    });
    if (version === undefined) {
      rest.deploymentStage = stage;
    }
    alias.addPermission(id.concat('Permission'), {
      action: 'lambda:InvokeFunction',
      scope: method,
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: method.methodArn.replace(rest.deploymentStage.stageName, id.toLowerCase()),
    });
  }
}
