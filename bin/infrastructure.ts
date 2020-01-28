#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RegistryStack } from '../lib/registry-stack';

const app = new cdk.App();
new RegistryStack(app, 'Registry');
