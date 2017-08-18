describe('trackEventMethodDecorator', () => {
  // eslint-disable-next-line global-require
  const trackEventMethodDecorator = require('../trackEventMethodDecorator').default;

  it('is a decorator (exports a function, that returns a function)', () => {
    expect(typeof trackEventMethodDecorator).toBe('function');

    const decorated = trackEventMethodDecorator();
    expect(typeof decorated).toBe('function');
  });

  it('properly calls trackEvent when trackingData is a plain object', () => {
    const dummyData = {};
    const trackingData = dummyData;
    const trackEvent = jest.fn();
    const spyTestEvent = jest.fn();

    class TestClass {
      constructor() {
        this.props = {
          tracking: {
            trackEvent,
          },
        };
      }

      @trackEventMethodDecorator(trackingData)
      handleTestEvent(x) { // eslint-disable-line class-methods-use-this
        spyTestEvent(x);
      }
    }

    const myTC = new TestClass();
    myTC.handleTestEvent('x');

    expect(trackEvent).toHaveBeenCalledWith(dummyData);
    expect(spyTestEvent).toHaveBeenCalledWith('x');
  });

  it('properly calls trackEvent when trackingData is a function', () => {
    const dummyData = {};
    const trackingData = jest.fn(() => dummyData);
    const trackEvent = jest.fn();
    const spyTestEvent = jest.fn();

    class TestClass {
      constructor() {
        this.props = {
          tracking: {
            trackEvent,
          },
        };
      }

      @trackEventMethodDecorator(trackingData)
      handleTestEvent = spyTestEvent
    }

    const myTC = new TestClass();
    myTC.handleTestEvent('x');

    expect(trackingData).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith(dummyData);
    expect(spyTestEvent).toHaveBeenCalledWith('x');
  });
});
