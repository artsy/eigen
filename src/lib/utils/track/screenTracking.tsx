import { Screen } from "@artsy/cohesion"
import React, { useEffect } from "react"
import _track, { TrackingInfo, useTracking } from "react-tracking"
import { postEventToProviders } from "./providers"
import * as Schema from "./schema"

interface ProvideScreenTrackingProps {
  info: Schema.PageView
}

// Uses schema manually defined in Eigen
@screenTrack<ProvideScreenTrackingProps>((props) => props.info)
export class ProvideScreenTracking extends React.Component<ProvideScreenTrackingProps> {
  render() {
    return React.createElement(React.Fragment, null, this.props.children)
  }
}

/**
 * Use this decorator with class components, but prefer functional components with the hook above.
 *
 * As an object:
 *
 * @example
 *
 *      ```ts
 *      import { screenTrack, Schema } from "lib/utils/track"
 *
 *       @screenTrack({
 *        context_screen: Schema.PageNames.ConsignmentsWelcome,
 *        context_screen_owner_slug: null,
 *        context_screen_owner_type: Schema.OwnerEntityTypes.Consignment,
 *       })
 *       export default class Welcome extends React.Component<Props, null> {
 *         // [...]
 *       }
 *
 * * As an function taking account of incoming props:
 *
 * @example
 *
 *      ```ts
 *      import { screenTrack, Schema } from "lib/utils/track"
 *
 *      interface Props extends ViewProps {
 *        // [...]
 *      }
 *
 *      @screenTrack<Props>(props => ({
 *        context_screen: Schema.PageNames.ConsignmentsSubmission,
 *        context_screen_owner_slug: props.submissionID,
 *        context_screen_owner_type: Schema.OwnerEntityTypes.Consignment,
 *      }))
 *      export default class Welcome extends React.Component<Props, null> {
 *        // [...]
 *      }
 */
export function screenTrack<P>(trackingInfo: TrackingInfo<Schema.PageView | Screen, P, null>) {
  return _track(trackingInfo as any, {
    dispatch: (data) => postEventToProviders(data),
    dispatchOnMount: true,
  })
}
