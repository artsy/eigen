/* eslint-disable react/no-multi-comp,react/prop-types,react/prefer-stateless-function  */
import React from 'react';
import { shallow, mount } from 'enzyme';

const dispatchTrackingEvent = jest.fn();
jest.setMock('../dispatchTrackingEvent', dispatchTrackingEvent);

const testDataContext = { testDataContext: true };
const testData = { testData: true };
const dispatch = jest.fn();

describe('e2e', () => {
  // eslint-disable-next-line global-require
  const track = require('../').default;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('defaults to dispatchTrackingEvent when no dispatch function passed in to options', () => {
    const testPageData = { page: 'TestPage' };

    @track(testPageData, { dispatchOnMount: true })
    class TestPage extends React.Component {
      render() {
        return null;
      }
    }

    mount(<TestPage />);

    expect(dispatchTrackingEvent).toHaveBeenCalledWith({
      ...testPageData,
    });
  });

  it('accepts a dispatch function in options', () => {
    @track(testDataContext, { dispatch })
    class TestOptions extends React.Component {
      @track(testData)
      blah = () => {}

      render() {
        this.blah();
        return <div />;
      }
    }

    mount(<TestOptions />);


    expect(dispatchTrackingEvent).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      ...testDataContext,
      ...testData,
    });
  });

  it('will use dispatch fn passed in from further up in context', () => {
    const testChildData = { page: 'TestChild' };

    @track(testDataContext, { dispatch })
    class TestOptions extends React.Component {
      render() {
        return this.props.children;
      }
    }

    @track(testChildData, { dispatchOnMount: true })
    class TestChild extends React.Component {
      render() {
        return <div />;
      }
    }

    mount(
      <TestOptions>
        <TestChild />
      </TestOptions>
    );

    expect(dispatch).toHaveBeenCalledWith({
      ...testDataContext,
      ...testChildData,
    });
  });

  it('will deep-merge tracking data', () => {
    const testData1 = { key: { x: 1, y: 1 } };
    const testData2 = { key: { x: 2, z: 2 }, page: 'TestDeepMerge' };

    @track(testData1)
    class TestData1 extends React.Component {
      render() { return this.props.children; }
    }

    const TestData2 = track(testData2, { dispatchOnMount: true })(() => <div />);

    mount(
      <TestData1>
        <TestData2 />
      </TestData1>
    );

    expect(dispatchTrackingEvent).toHaveBeenCalledWith({
      page: 'TestDeepMerge',
      key: {
        x: 2, y: 1, z: 2,
      },
    });
  });

  it('will call dispatchOnMount as a function', () => {
    const testDispatchOnMount = { test: true };
    const dispatchOnMount = jest.fn(() => ({ dom: true }));

    @track(testDispatchOnMount, { dispatch, dispatchOnMount })
    class TestComponent extends React.Component {
      render() { return null; }
    }

    mount(<TestComponent />);

    expect(dispatchOnMount).toHaveBeenCalledWith(testDispatchOnMount);
    expect(dispatch).toHaveBeenCalledWith({ dom: true, test: true });
  });

  it('will dispatch a pageview event on mount on class component', () => {
    const RawApp = ({ children }) => <div>{children}</div>;

    const App = track(
      { topLevel: true },
      {
        dispatch,
        process: (data) => {
          if (data.page) {
            return { event: 'pageView' };
          }
          return null;
        },
      }
    )(RawApp);

    @track({ page: 'Page' })
    class Page extends React.Component {
      render() {
        return <div>Page</div>;
      }
    }

    mount(<App><Page /></App>);

    expect(dispatch).toHaveBeenCalledWith({
      topLevel: true,
      event: 'pageView',
      page: 'Page',
    });
  });

  it('will dispatch a pageview event on mount on functional component', () => {
    const RawApp = ({ children }) => <div>{children}</div>;

    const App = track(
      { topLevel: true },
      {
        dispatch,
        process: (data) => {
          if (data.page) {
            return { event: 'pageView' };
          }
          return null;
        },
      },
    )(RawApp);

    const Page = track({ page: 'Page' })(() => <div>Page</div>);

    mount(<App><Page /></App>);

    expect(dispatch).toHaveBeenCalledWith({
      topLevel: true,
      event: 'pageView',
      page: 'Page',
    });
  });

  it('should not dispatch a pageview event on mount if there\'s no page property on tracking object', () => {
    const RawApp = ({ children }) => <div>{children}</div>;
    const App = track(
      { topLevel: true },
      {
        dispatch,
        process: () => null,
      },
    )(RawApp);
    const Page = track({ page: 'Page' })(() => <div>Page</div>);

    mount(<App><Page /></App>);

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('should not dispatch a pageview event on mount if proccess returns falsy value', () => {
    const RawApp = ({ children }) => <div>{children}</div>;
    const App = track(
      { topLevel: true },
      {
        dispatch,
        process: (data) => {
          if (data.page) {
            return { event: 'pageView' };
          }
          return false;
        },
      },
    )(RawApp);
    const Page = track({})(() => <div>Page</div>);

    mount(<App><Page /></App>);

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('will dispatch a top level pageview event on every page and component specific event on mount', () => {
    const RawApp = ({ children }) => <div>{children}</div>;

    const App = track(
      { topLevel: true },
      {
        dispatch,
        process: (data) => {
          if (data.page) {
            return { event: 'pageView' };
          }
          return null;
        },
      },
    )(RawApp);

    @track({ page: 'Page1' })
    class Page1 extends React.Component {
      render() {
        return <div>Page</div>;
      }
    }

    @track({ page: 'Page2' }, { dispatchOnMount: () => ({ page2specific: true }) })
    class Page2 extends React.Component {
      render() {
        return <div>Page</div>;
      }
    }

    mount(
      <App>
        <Page1 />
        <Page2 />
      </App>
    );

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith({ page: 'Page1', event: 'pageView', topLevel: true });
    expect(dispatch).toHaveBeenCalledWith({ page: 'Page2', event: 'pageView', topLevel: true, page2specific: true });
  });

  it('process works with trackingData as a function', () => {
    const RawApp = ({ children }) => <div>{children}</div>;

    const App = track(
      { topLevel: true },
      {
        dispatch,
        process: (data) => {
          if (data.page) {
            return { event: 'pageView' };
          }
          return null;
        },
      },
    )(RawApp);

    @track(({ runtimeData }) => ({ page: 'Page', runtimeData }))
    class Page extends React.Component {
      render() {
        return <div>Page</div>;
      }
    }

    mount(
      <App>
        <Page runtimeData />
      </App>
    );

    expect(dispatch).toHaveBeenCalledWith({ event: 'pageView', page: 'Page', runtimeData: true, topLevel: true });
  });

  it('doesn\'t dispatch pageview for nested components without page tracking data', () => {
    const RawApp = ({ children }) => <div>{children}</div>;

    const App = track(
      { topLevel: true },
      {
        dispatch,
        process: (data) => {
          if (data.page) {
            return { event: 'pageView' };
          }
          return null;
        },
      },
    )(RawApp);

    @track({ page: 'Page' })
    class Page extends React.Component {
      render() {
        return <div>{this.props.children}</div>;
      }
    }

    @track({ view: 'View' })
    class Nested extends React.Component {
      render() {
        return <div>{this.props.children}</div>;
      }
    }

    @track({ region: 'Button' })
    class Button extends React.Component {
      @track({ event: 'buttonClick' })
      handleClick = jest.fn()

      render() {
        return (
          <button onClick={this.handleClick}>
            Click me!
          </button>
        );
      }
    }

    const wrappedApp = mount(
      <App>
        <Page>
          <Nested>
            <Button />
          </Nested>
        </Page>
      </App>
    );

    wrappedApp.find('Button').simulate('click');

    expect(dispatch).toHaveBeenCalledWith({ event: 'pageView', page: 'Page', topLevel: true });
    expect(dispatch).toHaveBeenCalledWith({
      event: 'buttonClick',
      page: 'Page',
      region: 'Button',
      view: 'View',
      topLevel: true,
    });
    expect(dispatch).toHaveBeenCalledTimes(2); // pageview event and simulated button click
  });

  it('logs a console error when there is already a process defined on context', () => {
    global.console.error = jest.fn();
    const process = () => {};
    const context = { tracking: { process } };

    @track({}, { process })
    class TestComponent extends React.Component {
      render() {
        return <div />;
      }
    }

    shallow(<TestComponent />, { context });

    expect(global.console.error).toHaveBeenCalledTimes(1);
  });
});
