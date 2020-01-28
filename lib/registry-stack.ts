import core = require('@aws-cdk/core');
import codebuild = require('@aws-cdk/aws-codebuild');
import ecr = require('@aws-cdk/aws-ecr');

export class RegistryStack extends core.Stack {
  constructor(scope: core.App, id: string, props?: core.StackProps) {
    super(scope, id, props);

    const owner = 'evermos';
    const repo = 'evermos-fe';
    const name = 'evermos-frontend';

    const repository = new ecr.Repository(this, 'repository');

    const buildSpec = {
      docker: {
        version: 0.2,
        phases: {
          install: {
            'runtime-versions': {
              docker: 18,
            },
          },
          build: {
            commands: [
              'echo Logging in to Amazon ECR...',
              `$(aws ecr get-login --no-include-email)`,
              'echo Build started on $(date)',
              `docker build -t ${repository.repositoryUri}:latest .`,
              'echo Pushing Docker image...',
              `docker push ${repository.repositoryUri}:latest`,
            ],
          },
        },
      },
      nuxt: {},
      yii2: {},
    };

    const source = codebuild.Source.gitHub({
      owner,
      repo,
      webhook: true,
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs('master'),
      ],
    });

    const project = new codebuild.Project(this, 'project', {
      source,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_3_0,
        privileged: true,
      },
      buildSpec: codebuild.BuildSpec.fromObject(buildSpec.docker),
    });

    repository.grantPullPush(project.role!);
  }
}


