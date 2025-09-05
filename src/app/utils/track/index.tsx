import { Screen } from "@artsy/cohesion"
import React, { useLayoutEffect } from "react"
import _track, { Track as _Track, TrackingInfo, useTracking } from "react-tracking"
import { _addTrackingProvider, postEventToProviders, TrackingProvider } from "./providers"
// The schema definition for analytics tracking lives inside `./schema`, not here.
import * as Schema from "./schema"
export { Schema }

/**
 * Useful notes:
 *  * At the bottom of this file there is an example of how to test track'd code.
 */

/**
 * Use this interface to augment the `track` function with props, state, or custom tracking-info schema.
 *
 * @example
 *
 *      ```ts
 *      import { Schema, Track, track as _track } from "app/utils/track"
 *
 *      interface Props {
 *        artist: {
 *          id: string
 *          slug: string
 *        }
 *      }
 *
 *      interface State {
 *        following: boolean
 *      }
 *
 *      const track: Track<Props, State> = _track
 *
 *      @track()
 *      class Artist extends React.Component<Props, State> {
 *        render() {
 *          return (
 *            <div onClick={this.handleFollow.bind(this)}>
 *              ...
 *            </div>
 *          )
 *        }
 *
 *        @track((props, state) => ({
 *          action_type: Schema.ActionTypes.Tap,
 *          action_name: state.following ? Schema.ActionNames.ArtistUnfollow : Schema.ActionNames.ArtistFollow,
 *          owner_id: props.artist.internalID,
 *          owner_type: Schema.OwnerEntityTypes.Artist,
 *          owner_slug: props.artist.id,
 *        }))
 *        handleFollow() {
 *          // ...
 *        }
 *      }
 *
 *      ```
 */
export type Track<P = any, S = null, T extends Schema.Global = Schema.Entity> = _Track<T, P, S>

/**
 * A typed tracking-info alias of the default react-tracking `track` function.
 *
 * Use this when you don’t use a callback function to generate the tracking-info and only need the global schema.
 *
 * @example
 *
 *      ```ts
 *      import { track } from "app/utils/track"
 *
 *      @track()
 *      class Artist extends React.Component<{}, null> {
 *        render() {
 *          return (
 *            <div onClick={this.handleFollow.bind(this)}>
 *              ...
 *            </div>
 *          )
 *        }
 *
 *        @track({ action: "Follow Artist" })
 *        handleFollow() {
 *          // ...
 *        }
 *      }
 *      ```
 */
export const track: Track = (trackingInfo, options) => {
  return _track(trackingInfo, {
    ...options,
    dispatch: (data) => postEventToProviders(data),
  })
}

interface ProvideScreenTrackingProps {
  info: Schema.PageView
}

/** Deprecated
 * Please use `ProvideScreenTrackingWithCohesionSchema` instead.
 */
// Uses schema defined in Cohesion
export const ProvideScreenTracking: React.FC<
  React.PropsWithChildren<ProvideScreenTrackingProps>
> = (props) => {
  const tracking = useTracking()

  useLayoutEffect(() => {
    tracking.trackEvent(props.info)
  }, [tracking])

  return <React.Fragment>{props.children}</React.Fragment>
}

interface ProvideScreenTrackingWithCohesionSchemaProps {
  info: Screen
}
// Uses schema defined in Cohesion
export const ProvideScreenTrackingWithCohesionSchema: React.FC<
  React.PropsWithChildren<ProvideScreenTrackingWithCohesionSchemaProps>
> = (props) => {
  const tracking = useTracking()

  useLayoutEffect(() => {
    tracking.trackEvent(props.info)
  }, [])

  return <React.Fragment>{props.children}</React.Fragment>
}

/**
 * A typed page view decorator for the top level component for your screen. This is the
 * function you must use at the root of your component tree, otherwise your track calls
 * will do nothing.
 *
 * For the majority of Emission code, this should only be used inside the AppRegistry,
 * however if you have other components which are going to be presented using a navigation
 * controller then you'll need to use this.
 *
 * The main implementation difference between this and `track` is that this hooks the callbacks
 * to our native `Events.postEvent` function.
 *
 * As an object:
 *
 * @example
 *
 *      ```ts
 *      import { screenTrack, Schema } from "app/utils/track"
 *
 *       @screenTrack({
 *        context_screen: Schema.PageNames.ConsignmentsWelcome,
 *        context_screen_owner_slug: null,
 *        context_screen_owner_type: Schema.OwnerEntityTypes.Consignment,
 *       })
 *
 *       export default class Welcome extends React.Component<Props, null> {
 *         // [...]
 *       }
 *
 * * As an function taking account of incoming props:
 *
 * @example
 *
 *      ```ts
 *      import { screenTrack, Schema } from "app/utils/track"
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
 *
 *      export default class Welcome extends React.Component<Props, null> {
 *        // [...]
 *      }
 */
export function screenTrack<P>(trackingInfo: TrackingInfo<Schema.PageView, P, null>) {
  return _track(trackingInfo as any, {
    dispatch: (data) => postEventToProviders(data),
    dispatchOnMount: true,
  })
}

/*
 * ## Writing tests for your tracked code
 *
 * By default we mock `react-tracking`, so it's not possible to test the code easily.
 *
 * A good pattern for testing analytics code is to have a completely separate file
 * for the tests. For example: `Overview-analytics-tests.tsx`. Jest has each
 * test file run in a unique environment, so in that file we can unmock react-tracking.
 *
 * Here's a full example:
 *
 * @example
 *
 *       ```ts
 *      import { fireEvent } from "@testing-library/react-native"
 *      import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
 *      import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
 *       *
 *      // Unmock react-tracking so that it will wrap our code
 *      jest.unmock("react-tracking")
 *      import Overview from "../Overview"
 *
 *      // make it reset between tests
 *      beforeEach(jest.resetAllMocks)
 *
 *      it("calls the draft created event", () => {
 *
 *        // Use rntl to render the component tree
 *        const { getByText } = renderWithWrappers(<Overview [...] />)
 *
 *        // Run the function which triggers the tracking call
 *        fireEvent.press(getByText("button"))
 *
 *        // Check that the native event for the analytics call is sent
 *        expect(mockTrackEvent).toHaveBeenCalledTimes(1)
 *        expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
 *          Array [
 *           Object {
 *            "action_name": "consignmentDraftCreated",
 *            "action_type": "success",
 *            "context_screen": "ConsignmentsOverview",
 *            "context_screen_owner_type": "ConsignmentSubmission",
 *            "owner_id": "123",
 *            "owner_slug": "123",
 *            "owner_type": "ConsignmentSubmission",
 *           },
 *          ]
 *        `)
 *      })
 *      ```
 *
 */

export const addTrackingProvider = (name: string, provider: TrackingProvider) => {
  _addTrackingProvider(name, provider)
}
