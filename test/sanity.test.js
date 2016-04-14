/* eslint-env node, mocha */

// https://medium.com/@jcfrancisco/unit-testing-react-native-components-a-firsthand-guide-cea561df242b#.ym5r45t78

import common from './support/common';
const { createShallowRenderer, React, expect, MockComponents } = common;

class TestFixture extends React.Component {
  render() {
    return <MockComponents.ScrollView />;
  }
}

function setup() {
  const props = {};

  const renderer = createShallowRenderer();
  renderer.render(<TestFixture {...props} />);
  const output = renderer.getRenderOutput();

  return {
    props,
    output,
    renderer,
  };
}

describe('TestFixture', () => {
  it('should render a scrollview', () => {
    const { output } = setup();
    expect(output.type.displayName).to.equal(MockComponents.ScrollView.displayName);
  });
});
