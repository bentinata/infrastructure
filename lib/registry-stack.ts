import core = require('@aws-cdk/core');
import codebuild = require('@aws-cdk/aws-codebuild');
import ecr = require('@aws-cdk/aws-ecr');

interface GitSourceProps {
  readonly owner?: string;
  readonly repo: string;
  readonly branch?: string;
}

interface RegistryProps extends core.StackProps {
  readonly gitSource: GitSourceProps;
  readonly buildEnv: { [key: string]: string };
}

export class RegistryStack extends core.Stack {
  private readonly owner: string;
  private readonly repo: string;
  private readonly branch: string;
  private readonly env: { [key: string]: string };

  constructor(scope: core.App, id: string, props: RegistryProps) {
    super(scope, id, props);

    this.owner = props.gitSource.owner === undefined ? 'evermos' : props.gitSource.owner;
    this.repo = props.gitSource.repo;
    this.branch = props.gitSource.branch === undefined ? 'dev' : props.gitSource.branch;
    this.env = props.buildEnv;

    const repository = new ecr.Repository(this, 'repository');

    const buildSpec = {
      docker: {
        version: 0.2,
        env: {
          'parameter-store': this.env,
        },
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
      owner: this.owner,
      repo: this.repo,
      webhook: true,
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs(this.branch),
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
