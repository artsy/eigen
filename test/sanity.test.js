/* eslint-env node, mocha */
import common from './support/common';
const { createRenderer, React, expect, MockComponents } = common;

class TestFixture extends React.Component {
  render() {
    return <MockComponents.ScrollView />;
  }
}

function setup() {
  const props = {};

  const renderer = createRenderer();
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
