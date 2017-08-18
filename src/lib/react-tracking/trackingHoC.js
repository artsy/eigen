import withTrackingComponentDecorator from './withTrackingComponentDecorator';
import trackEventMethodDecorator from './trackEventMethodDecorator';

export default function hoc(trackingInfo, options) {
  return function decorator(...toDecorate) {
    if (toDecorate.length === 1) {
      // decorating a class
      return withTrackingComponentDecorator(trackingInfo, options)(...toDecorate);
    }

    // decorating a method
    return trackEventMethodDecorator(trackingInfo)(...toDecorate);
  };
}
