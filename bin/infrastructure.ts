#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RegistryStack } from '../lib/registry-stack';
import { mapList } from '../lib/util';

const app = new cdk.App();

/*
evermos-fe:dev
evermos-fe.dev.evermosa2z.com

evermos-be:dev
evermos-be.dev.evermosa2z.com

source: 'evermos-be:dev',
domain: evermos-be.dev.evermosa2z.com

evermos-fe:ft-tracking
evermos-fe-ft-tracking.dev.evermosa2z.com

evermos-fe:b00579d
evermos-fe-b00579d.dev.evermosa2z.com
*/

new RegistryStack(app, 'Registry', {
  gitSource: {
    owner: 'evermos',
    repo: 'evermos-fe',
    branch: 'master',
  },
  buildEnv: mapList(['API_HOST', 'API_CLIENT_SECRET'], 'PRO')
});
