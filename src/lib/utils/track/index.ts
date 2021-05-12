import _track, { Track as _Track } from "react-tracking"
import { _addTrackingProvider, postEventToProviders, TrackingProvider } from "./providers"
// The schema definition for analytics tracking lives inside `./schema`, not here.
import * as Schema from "./schema"

export { Schema }
export {
  useScreenTracking,
  screenTrack,
  ProvideScreenTracking,
  ProvideScreenTrackingWithCohesionSchema,
} from "./screenTracking"

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
 *      import { Schema, Track, track as _track } from "lib/utils/track"
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
export interface Track<P = any, S = null, T extends Schema.Global = Schema.Entity> extends _Track<T, P, S> {} // tslint:disable-line:no-empty-interface

/**
 * A typed tracking-info alias of the default react-tracking `track` function.
 *
 * Use this when you don’t use a callback function to generate the tracking-info and only need the global schema.
 *
 * @example
 *
 *      ```ts
 *      import { track } from "lib/utils/track"
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

/*
 * ## Writing tests for your tracked code
 *
 * By default we mock `react-tracking`, so it's not possible to test the code easily.
 *
 * A good pattern for testing analytics code is to have a completely separate file
 * for the tests. For example: `__tests__/Overview-analytics-tests.tsx`. Jest has each
 * test file run in a unique environment, so in that file we can unmock react-tracking.
 *
 * Here's a full example:
 *
 * @example
 *
 *       ```ts
 *      import { shallow } from "enzyme"
 *      import Event from "lib/NativeModules/Events"
 *      import React from "react"
 *
 *      // Unmock react-tracking so that it will wrap our code
 *      jest.unmock("react-tracking")
 *      import Overview from "../Overview"
 *
 *      // Create a stub for checking the events sent to the native code
 *      // and make it reset between tests
 *      jest.mock("lib/NativeModules/Events", () => ({ postEvent: jest.fn() }))
 *      beforeEach(jest.resetAllMocks)
 *
 *      it("calls the draft created event", () => {
 *
 *        // Use enzyme to render the component tree
 *        // note that we need to `dive` into the first child component
 *        // so that we get to the real component not the reac-tracking HOC
 *        const overviewComponent = shallow(<Overview [...] />).dive()
 *        const overview = overviewComponent.instance()
 *
 *        // Run the function which triggers the tracking call
 *        overview.submissionDraftCreated()
 *
 *        // Check that the native event for the analytics call is sent
 *        expect(postEvent).toBeCalledWith({
 *          action_name: "consignmentDraftCreated",
 *          action_type: "success",
 *          context_screen: "ConsignmentsOverview",
 *          context_screen_owner_type: "ConsignmentSubmission",
 *          owner_id: "123",
 *          owner_slug: "123",
 *          owner_type: "ConsignmentSubmission",
 *        })
 *      })
 *      ```
 *
 */

export const addTrackingProvider = (name: string, provider: TrackingProvider) => {
  _addTrackingProvider(name, provider)
}
