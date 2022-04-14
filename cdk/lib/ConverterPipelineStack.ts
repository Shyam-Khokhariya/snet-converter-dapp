import * as cdk from '@aws-cdk/core';
import * as dotenv from 'dotenv';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as deploy from '@aws-cdk/aws-s3-deployment';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import { Role } from '@aws-cdk/aws-iam';

// dotenv Must be the first expression
dotenv.config();

const region = <string>process.env.CDK_REGION;
const environment = <string>process.env.CDK_ENVIRONMENT;
const configBucket = <string>process.env.APP_CONFIGS_S3_BUCKET_NAME;
const appConfigsFolder = <string>process.env.APP_CONFIGS_S3_FOLDER;

const githubOwner = <string>process.env.GITHUB_OWNER;
const githubRepo = <string>process.env.GITHUB_REPO;
const githubBranch = <string>process.env.GITHUB_BRANCH;

const S3_BUCKET_NAME = `${environment}-converter-dapp`;
const CD_ROLE_ARN = <string>process.env.SINGULARITYNET_CD_ROLE_ARN;
const CERTIFICATE_ARN = <string>process.env.CERTIFICATE_ARN;
const CDN_DOMAIN_NAME = <string>process.env.CDN_DOMAIN_NAME;
const S3_WEBSITE_DOMAIN = `${S3_BUCKET_NAME}.s3-website-${region}.amazonaws.com`;

export class ConverterPipeLineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: any) {
    super(scope, id, props);

    const role = Role.fromRoleArn(this, 'AccessPolicy', CD_ROLE_ARN);

    const projectSource = codebuild.Source.gitHub({
      owner: githubOwner,
      repo: githubRepo,
      branchOrRef: githubBranch,
      fetchSubmodules: false,
      webhook: true,
      webhookTriggersBatchBuild: false,
      webhookFilters: [codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs(githubBranch)]
    });

    new codebuild.Project(this, `${environment}-converter-dapp-source`, {
      source: projectSource,
      concurrentBuildLimit: 1,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0
      },
      role,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          pre_build: {
            commands: ['node --version', `aws s3 sync s3://${configBucket}/${appConfigsFolder}/app .`, 'npm install']
          },
          build: {
            commands: ['npm run build', 'cd cdk', `aws s3 sync s3://${configBucket}/${appConfigsFolder}/cdk .`, 'npm install', 'npm run deploy']
          }
        }
      })
    });

    const siteBucket = new s3.Bucket(this, `${environment}-converter-bucket`, {
      bucketName: S3_BUCKET_NAME,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const convertDappCertificate = acm.Certificate.fromCertificateArn(this, 'ConverterDappCertificate', CERTIFICATE_ARN);

    const siteDistribution = new cloudfront.Distribution(this, `${environment}-converter-dapp-distribution`, {
      defaultRootObject: 'index.html',
      domainNames: [CDN_DOMAIN_NAME],
      certificate: convertDappCertificate,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(10)
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(10)
        }
      ],
      defaultBehavior: {
        origin: new origins.HttpOrigin(S3_WEBSITE_DOMAIN),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS
      }
    });

    new deploy.BucketDeployment(this, `${environment}-converter-dapp-deployment`, {
      sources: [deploy.Source.asset('../build')],
      destinationBucket: siteBucket,
      distribution: siteDistribution,
      distributionPaths: ['/*'],
      prune: true
    });
  }
}
