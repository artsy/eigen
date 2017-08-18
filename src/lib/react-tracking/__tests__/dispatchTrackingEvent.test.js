import dispatchTrackingEvent from '../dispatchTrackingEvent';

const testEventData = { test: 'magik' };

describe('dispatchTrackingEvent', () => {
  beforeEach(() => {
    window.dataLayer = undefined;
  });

  it('exports a function', () => {
    expect(typeof dispatchTrackingEvent).toBe('function');
  });

  it('will create window.dataLayer[] if it does not exit', () => {
    expect(window.dataLayer).not.toBeDefined();

    dispatchTrackingEvent(testEventData);

    expect(window.dataLayer).toEqual([testEventData]);
  });

  it('will push to window.dataLayer[] if it exists', () => {
    expect(window.dataLayer).not.toBeDefined();

    dispatchTrackingEvent(testEventData);
    expect(window.dataLayer).toEqual([testEventData]);

    dispatchTrackingEvent(testEventData);
    expect(window.dataLayer).toEqual([testEventData, testEventData]);
  });
});
