/* @flow */
'use strict';

import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@kadira/react-native-storybook';

// import your stories
configure(() => {
  require('../stories');
}, module);

const StorybookUI = getStorybookUI({port: 9001, host: 'localhost'});
AppRegistry.registerComponent('Storybook', () => StorybookUI);
