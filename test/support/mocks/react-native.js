import React from 'react';

function mockComponent(type) {
  const Component = React.createClass({
    displayName: type,
    propTypes: { children: React.PropTypes.node },
    render() { return React.createElement(React.DOM.div, this.props, this.props.children); },
  });
  return Component;
}

const componentsToMock = [
  'View',
  'Text',
  'Component',
  'ScrollView',
  'TextInput',
];

export const MockComponents = componentsToMock.reduce((agg, type) => {
  agg[type] = mockComponent(type);
  return agg;
}, {});

export default {
  ...React,
  ...MockComponents,
  StyleSheet: {
    create: (ss) => ss,
  },
  PropTypes: React.PropTypes,
};
