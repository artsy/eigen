import React, { Component } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash.merge';
import dispatchTrackingEvent from './dispatchTrackingEvent';

export const TrackingContextType = PropTypes.shape({
  data: PropTypes.object,
  dispatch: PropTypes.func,
  process: PropTypes.func,
});

export default function withTrackingComponentDecorator(
  trackingData = {},
  {
    dispatch = dispatchTrackingEvent,
    dispatchOnMount = false,
    process,
  } = {}
) {
  return (DecoratedComponent) => {
    const decoratedComponentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';

    return class WithTracking extends Component {
      constructor(props, context) {
        super(props, context);

        if (context.tracking && context.tracking.process && process) {
          console.error('[react-tracking] options.process should be used once on top level component');
        }

        this.ownTrackingData = typeof trackingData === 'function'
          ? trackingData(props)
          : trackingData;
        this.contextTrackingData = (this.context.tracking && this.context.tracking.data) || {};
        this.trackingData = merge({}, this.contextTrackingData, this.ownTrackingData);
      }

      static displayName = `WithTracking(${decoratedComponentName})`;
      static contextTypes = {
        tracking: TrackingContextType,
      };
      static childContextTypes = {
        tracking: TrackingContextType,
      };

      trackEvent = (data) => {
        this.getTrackingDispatcher()(
          // deep-merge tracking data from context and tracking data passed in here
          merge({}, this.trackingData, data)
        );
      }

      getTrackingDispatcher() {
        return (this.context.tracking && this.context.tracking.dispatch) || dispatch;
      }

      getChildContext() {
        return {
          tracking: {
            data: merge({}, this.contextTrackingData, this.ownTrackingData),
            dispatch: this.getTrackingDispatcher(),
            process: (this.context.tracking && this.context.tracking.process) || process,
          },
        };
      }

      componentDidMount() {
        const contextProcess = this.context.tracking && this.context.tracking.process;

        if (typeof contextProcess === 'function' && typeof dispatchOnMount === 'function') {
          this.trackEvent(merge(
            {},
            contextProcess(this.ownTrackingData),
            dispatchOnMount(this.trackingData)
          ));
        } else if (typeof contextProcess === 'function') {
          const processed = contextProcess(this.ownTrackingData);
          if (processed) {
            this.trackEvent(processed);
          }
        } else if (typeof dispatchOnMount === 'function') {
          this.trackEvent(dispatchOnMount(this.trackingData));
        } else if (dispatchOnMount === true) {
          this.trackEvent();
        }
      }

      tracking = {
        trackEvent: this.trackEvent,
        getTrackingData: () => this.trackingData,
      }

      render() {
        return (
          <DecoratedComponent
            {...this.props}
            tracking={this.tracking}
          />
        );
      }
    };
  };
}
