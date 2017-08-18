jest.mock('../withTrackingComponentDecorator');
jest.mock('../trackEventMethodDecorator');

describe('react-tracking', () => {
  // eslint-disable-next-line global-require
  const index = require('../');

  it('exports withTracking', () => {
    expect(index.withTracking).toBeDefined();
  });
  it('exports trackEvent', () => {
    expect(index.trackEvent).toBeDefined();
  });
  it('exports TrackingContextType', () => {
    expect(index.TrackingContextType).toBeDefined();
  });
  it('exports TrackingPropType', () => {
    expect(index.TrackingPropType).toBeDefined();
  });
  it('exports default function', () => {
    expect(typeof index.default).toBe('function');
  });
});
