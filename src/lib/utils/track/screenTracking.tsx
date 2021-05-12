import * as Schema from "./schema"
import { Screen } from "@artsy/cohesion"
import React, { useEffect } from "react"
import _track, { TrackingInfo, useTracking } from "react-tracking"
import { postEventToProviders } from "./providers"

/**
 * Use this hook with functional components to track screen attributes.
 *
 * @example
 *
 * export const SomeScreen = () => {
 *   useScreenTracking({
 *     context_screen: Schema.PageNames.SomeScreen
 *   })
 *
 *   return (
 *     // [...]
 *   )
 * }
 */
export const useScreenTracking = (info: Schema.PageView | Screen) => {
  const { trackEvent } = useTracking()
  useEffect(() => {
    trackEvent(info)
  }, [])
}

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

interface ProvideScreenTrackingWithCohesionSchemaProps {
  info: Screen
}
// Uses schema defined in Cohesion
@screenTrack<ProvideScreenTrackingProps>((props) => props.info)
export class ProvideScreenTrackingWithCohesionSchema extends React.Component<ProvideScreenTrackingWithCohesionSchemaProps> {
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
