import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import {MockComponents} from './mocks/react-native';

chai.use(chaiAsPromised);

export default {
  expect: chai.expect,
  createRenderer: ReactTestUtils.createRenderer,
  React,
  MockComponents,
};
