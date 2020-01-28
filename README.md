<p align="center"><img src="docs/logo.svg"></p>

# Evermos CDK Infrastructure

This is a project for Evermos Infrastructure development with TypeScript CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

# Requirement

- node v12 or more
- aws cli with configured auth
- `npm ci`

# Commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `cdk synth` emits the synthesized CloudFormation template
- `cdk diff` compare deployed stack with current state
- `cdk deploy` deploy this stack to your default AWS account/region

# Example

```
npm run build
cdk diff
cdk deploy
```

# Issues
Use [Phabricator](https://phabricator.evermosa2z.com/maniphest/task/edit/form/default) with `DevOps` tag.
