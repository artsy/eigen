import _track, { Track as _Track, TrackingInfo } from "react-tracking"

import Events from "lib/NativeModules/Events"

/**
 * Useful notes:
 *  * At the bottom of this file there is an example of how to test track'd code.
 */

// tslint:disable-next-line:no-namespace
export namespace Schema {
  /**
   * The global tracking-info keys in Artsy’s schema.
   */
  export interface Global {
    /**
     * The name of an event.
     *
     * Options are: Tap, Fail, Success
     *
     * This is unique to a "Track" event, meaning a "screen view" in Segment does not have this
     * This is how we distinguish the two type of events in Eigen
     * Track data inherits the screen view (called "context_screen") properties
     *
     */
    action_type: ActionTypes

    /**
     * The discription of an event
     *
     * E.g. Conversation artwork attachment tapped
     */
    action_name: ActionNames

    /**
     * OPTIONAL: Additional properties of the action
     */
    additional_properties?: object
  }

  export interface Entity extends Global {
    /**
     * The ID of the entity in its database. E.g. the Mongo ID for entities that reside in Gravity.
     */
    owner_id: string

    /**
     * The public slug for this entity.
     */
    owner_slug: string

    /**
     * The type of entity, e.g. Artwork, Artist, etc.
     */
    owner_type: OwnerEntityTypes
  }

  export interface PageView {
    /**
     * The root container component should specify this as the screen context.
     */
    context_screen: PageNames

    /**
     * The public slug for the entity that owns this page (e.g. for the Artist page)
     */
    context_screen_owner_slug?: string

    /**
     * The ID of the entity in its database. E.g. the Mongo ID for entities that reside in Gravity.
     *
     * OPTIONAL: This may not always be available before the relay call for props has been made
     */
    context_screen_owner_id?: string

    /**
     * The type of entity (owner), E.g. Artist, Artwork, etc.
     */
    context_screen_owner_type: OwnerEntityTypes
  }

  export enum PageNames {
    ArtistPage = "Artist",
    BidFlowMaxBidPage = "YourMaxBid",
    BidFlowConfirmBidPage = "ConfirmYourBid",
    BidFlowBillingAddressPage = "YourBillingAddress",
    BidFlowRegistration = "Registration",
    BidFlowRegistrationResultConfirmed = "RegistrationConfirmed",
    BidFlowRegistrationResultPending = "RegistrationPending",
    BidFlowRegistrationResultError = "RegistrationError",
    ConversationPage = "Conversation",
    ConsignmentsWelcome = "ConsignmentsWelcome",
    ConsignmentsOverView = "ConsignmentsOverview",
    ConsignmentsSubmission = "ConsignmentsSubmit",
    GenePage = "Gene",
    FairPage = "Fair",
    ShowPage = "Show",
    AboutTheShowPage = "AboutTheShow",
    InboxPage = "Inbox",
    InquiryPage = "Inquiry",
    HomeArtistsWorksForYou = "HomeArtistsWorksForYou",
    HomeForYou = "HomeForYou",
    HomeAuctions = "HomeAuctions",
    SavesAndFollows = "SavesAndFollows",
  }

  export enum OwnerEntityTypes {
    Artist = "Artist",
    Artwork = "Artwork",
    Conversation = "Conversation",
    Gene = "Gene",
    Fair = "Fair",
    Show = "Show",
    Invoice = "Invoice",
    Consignment = "ConsignmentSubmission",
  }

  export enum ActionTypes {
    /**
     * User actions
     */
    Tap = "tap",

    /**
     * Events / results
     */
    Fail = "fail",
    Success = "success",
  }

  /**
   * Action event discriptors / names
   */
  export enum ActionNames {
    /**
     * Artist Page Events
     */
    ArtistAbout = "artistAbout",
    ArtistFollow = "artistFollow",
    ArtistUnfollow = "artistUnfollow",
    ArtistWorks = "artistWorks",
    ArtistShows = "artistShows",

    /**
     * Gene Page Events
     */
    GeneAbout = "geneAbout",
    GeneFollow = "geneFollow",
    GeneUnfollow = "geneUnfollow",
    GeneWorks = "geneWorks",
    Refine = "geneRefine",

    /**
     * Home page events
     */
    HomeArtistRailFollow = "homeArtistRailFollow",
    HomeArtistArtworksBlockFollow = "homeArtistArtworksBlockFollow",

    /**
     * Conversations / Inbox / Messaging Events
     */
    ConversationSelected = "conversationSelected",
    ConversationSendReply = "conversationSendReply",
    ConversationAttachmentShow = "conversationAttachmentShow",
    ConversationAttachmentArtwork = "conversationAttachmentArtwork",
    ConversationAttachmentInvoice = "conversationAttachmentInvoice",
    ConversationLink = "conversationLinkUsed",
    InquiryCancel = "inquiryCancel",
    InquirySend = "inquirySend",

    /**
     *  Saves And Follows Events
     */
    SavesAndFollowsWorks = "savesAndFollowsWorks",
    SavesAndFollowsArtists = "savesAndFollowsArtists",
    SavesAndFollowsCategories = "savesAndFollowsCategories",

    /**
     *  Consignment flow
     */
    ConsignmentDraftCreated = "consignmentDraftCreated",
    ConsignmentSubmitted = "consignmentSubmitted",

    /**
     * Bid flow
     */
    BidFlowAddBillingAddress = "addBillingAddress",
    BidFlowPlaceBid = "placeBid",
    BidFlowSaveBillingAddress = "saveBillingAddress",

    /**
     * Show flow
     */
    ShowAllArtists = "showAllArtists",
    ShowAllArtworks = "showAllArtworks",
    SingleShowMap = "singleShowMap",
  }
}

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
