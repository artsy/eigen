import React from 'react';
import { shallow } from 'enzyme';

const mockDispatchTrackingEvent = jest.fn();
jest.setMock('../dispatchTrackingEvent', mockDispatchTrackingEvent);

describe('withTrackingComponentDecorator', () => {
  // eslint-disable-next-line global-require
  const withTrackingComponentDecorator = require('../withTrackingComponentDecorator').default;

  it('is a decorator (exports a function, that returns a function)', () => {
    expect(typeof withTrackingComponentDecorator).toBe('function');

    const decorated = withTrackingComponentDecorator();
    expect(typeof decorated).toBe('function');
  });

  describe('with a function trackingContext', () => {
    const props = { props: 1 };
    const context = { context: 1 };
    const trackingContext = jest.fn(() => {});

    @withTrackingComponentDecorator(trackingContext)
    class TestComponent {
      static displayName = 'TestComponent';
    }

    const myTC = new TestComponent(props, context);

    beforeEach(() => {
      mockDispatchTrackingEvent.mockClear();
    });

    it('defines the expected static properties', () => {
      expect(TestComponent.displayName).toBe('WithTracking(TestComponent)');
      expect(TestComponent.contextTypes.tracking).toBeDefined();
      expect(TestComponent.childContextTypes.tracking).toBeDefined();
    });

    it('calls trackingContext() in getChildContext', () => {
      expect(myTC.getChildContext().tracking.data).toEqual({});
      expect(trackingContext).toHaveBeenCalledTimes(1);
    });

    it('dispatches event in trackEvent', () => {
      const data = { data: 1 };
      myTC.trackEvent({ data });
      expect(mockDispatchTrackingEvent).toHaveBeenCalledWith({ data });
    });

    it('does not dispatch event in componentDidMount', () => {
      myTC.componentDidMount();
      expect(mockDispatchTrackingEvent).not.toHaveBeenCalled();
    });

    it('renders', () => {
      expect(myTC.render()).toBeDefined();
    });
  });

  describe('with an object trackingContext', () => {
    const props = { props: 1 };
    const context = { context: 1 };
    const trackingContext = { page: 1 };

    @withTrackingComponentDecorator(trackingContext, { dispatchOnMount: true })
    class TestComponent {
      static displayName = 'TestComponent';
    }

    const myTC = new TestComponent(props, context);

    beforeEach(() => {
      mockDispatchTrackingEvent.mockClear();
    });

    // We'll only test what differs from the functional trackingContext variation

    it('returns the proper object in getChildContext', () => {
      expect(myTC.getChildContext().tracking).toEqual({
        data: trackingContext,
        dispatch: mockDispatchTrackingEvent,
      });
    });

    it('dispatches event in componentDidMount', () => {
      myTC.componentDidMount();
      expect(mockDispatchTrackingEvent).toHaveBeenCalledWith(trackingContext);
    });
  });

  describe('with process option', () => {
    const props = { props: 1 };
    const trackingContext = { page: 1 };
    const process = jest.fn(() => ({ event: 'pageView' }));
    const context = { context: 1, tracking: { process } };

    @withTrackingComponentDecorator(trackingContext)
    class TestComponent {
      static displayName = 'TestComponent';
    }

    const myTC = new TestComponent(props, context);

    beforeEach(() => {
      mockDispatchTrackingEvent.mockClear();
    });

    it('process function gets called', () => {
      myTC.componentDidMount();
      expect(process).toHaveBeenCalled();
      expect(mockDispatchTrackingEvent).toHaveBeenCalledWith({ page: 1, event: 'pageView' });
    });
  });

  describe('with process option from parent and dispatchOnMount option on component', () => {
    const props = { props: 1 };
    const trackingContext = { page: 1 };
    const process = jest.fn(() => ({ event: 'pageView' }));
    const context = { context: 1, tracking: { process } };
    const dispatchOnMount = jest.fn(() => ({ specificEvent: true }));

    @withTrackingComponentDecorator(trackingContext, { dispatchOnMount })
    class TestComponent {
      static displayName = 'TestComponent';
    }

    const myTC = new TestComponent(props, context);

    beforeEach(() => {
      mockDispatchTrackingEvent.mockClear();
    });

    it('dispatches only once when process and dispatchOnMount functions are passed', () => {
      myTC.componentDidMount();
      expect(process).toHaveBeenCalled();
      expect(dispatchOnMount).toHaveBeenCalled();
      expect(mockDispatchTrackingEvent).toHaveBeenCalledWith({ page: 1, event: 'pageView', specificEvent: true });
      expect(mockDispatchTrackingEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('with a prop called tracking that has two functions as keys', () => {
    const dummyData = { page: 1 };

    @withTrackingComponentDecorator(dummyData)
    class TestComponent {
      static displayName = 'TestComponent';
    }

    const component = shallow(<TestComponent />);

    beforeEach(() => {
      mockDispatchTrackingEvent.mockClear();
    });

    it('prop is named tracking and has two keys, trackEvent and getTrackingData', () => {
      expect(component.props().tracking).toBeDefined();
      expect(component.props().tracking).toBeInstanceOf(Object);
      expect(component.props().tracking).toHaveProperty('trackEvent');
      expect(component.props().tracking).toHaveProperty('getTrackingData');
    });

    it('prop named trackEvent is a function', () => {
      expect(component.props().tracking.trackEvent).toBeInstanceOf(Function);
    });

    it('when trackEvent is called, from props, it will dispatch event in trackEvent', () => {
      expect(mockDispatchTrackingEvent).not.toHaveBeenCalled();
      component.props().tracking.trackEvent(dummyData);
      expect(mockDispatchTrackingEvent).toHaveBeenCalledWith(dummyData);
    });

    it('prop named getTrackingData is a function', () => {
      expect(component.props().tracking.getTrackingData).toBeInstanceOf(Function);
    });

    it('when getTrackingData is called, from props, it will return the data passed to the decorator', () => {
      expect(component.props().tracking.getTrackingData()).toMatchObject(dummyData);
    });
  });
});
