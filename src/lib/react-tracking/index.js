import withTracking, { TrackingContextType } from './withTrackingComponentDecorator';
import trackEvent from './trackEventMethodDecorator';
import TrackingPropType from './TrackingPropType';
import trackingHOC from './trackingHoC';

export default trackingHOC

export {
  withTracking,
  trackEvent,
  TrackingPropType
}
