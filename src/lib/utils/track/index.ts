import _track, { Track as _Track, TrackingInfo } from "react-tracking"

import Events from "lib/NativeModules/Events"

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
 *          owner_id: props.artist._id,
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
export const track: Track = _track

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
 *      import { screenTrack, Schema } from "lib/utils/track"
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
 *      import { screenTrack, Schema } from "lib/utils/track"
 *
 *      interface Props extends ViewProperties {
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
    dispatch: data => Events.postEvent(data),
    dispatchOnMount: true,
  })
}

/**
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
 *        expect(Event.postEvent).toBeCalledWith({
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
