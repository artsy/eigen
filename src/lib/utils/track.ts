import * as React from "react"
import _track, { Track as _Track } from "react-tracking"

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
     */
    action_type: string

    /**
     * The discription of an event
     *
     * E.g. Conversation artwork attatchment tapped
     */
    action_name: string

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
    owner_type: string
  }

  export interface PageView {
    /**
     * The root container component should specify this as the screen context.
     */
    context_screen: string

    /**
     * The public slug for the entity that owns this page (e.g. for the Artist page)
     */
    context_screen_owner_slug?: string

    /**
     * The ID of the entity in its database. E.g. the Mongo ID for entities that reside in Gravity.
     *
     * OPTIONAL: This may not always be available
     */
    context_screen_owner_id?: string

    /**
     * The type of entity (owner), E.g. Artist, Artwork, etc.
     */
    context_screen_owner_type: string
  }

  export const PageNames = {
    artistPage: "Artist",
    inboxPage: "Inbox",
  }

  export const OwnerEntityTypes = {
    artist: "Artist",
    artwork: "Artwork",
    conversation: "Conversation",
    gene: "Gene",
    show: "Show",
    invoice: "Invoice",
  }

  export const ActionEventTypes = {
    /**
     * User actions
     */
    tap: "tap",

    /**
     * Events / results
     */
    fail: "fail",
    success: "success",
  }

  /**
   * Action event discriptors / names
   */
  export const ActionEventNames = {
    /**
     * Artist Page Events
     */
    artistFollow: "artistFollow",
    artistUnfollow: "artistUnfollow",

    /**
     * Conversations / Inbox / Messaging Events
     */
    conversationSelected: "conversationSelected",
    conversationSendReply: "conversationSendReply",
    conversationAttachmentShow: "conversationAttachmentShow",
    conversationAttachmentArtwork: "conversationAttachmentArtwork",
    conversationAttachmentInvoice: "conversationAttachmentInvoice",
    conversationLink: "conversationLinkUsed",
    inquiryCancel: "inquiryCancel",
    inquirySend: "inquirySend",
  }
}

/**
 * Use this interface to augment the `track` function with props, state, or custom tracking-info schema.
 *
 * @example
 *
 *      ```ts
 *      import { Schema, Track, track as _track } from "src/utils/track"
 *
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
 *      const track: Track<Props, State, Schema.Entity> = _track
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
 *          action: `${state.following ? "Unfollow" : "Follow"} Artist`,
 *          entity_id: props.artist.id,
 *          entity_slug: props.artist.slug
 *        }))
 *        handleFollow() {
 *          // ...
 *        }
 *      }
 *
 *      ```
 */
export interface Track<P = any, S = any, T extends Schema.Global = Schema.Global> extends _Track<T, P, S> {} // tslint:disable-line:no-empty-interface

/**
 * A typed tracking-info alias of the default react-tracking `track` function.
 *
 * Use this when you don’t use a callback function to generate the tracking-info and only need the global schema.
 *
 * @example
 *
 *      ```ts
 *      import { track } from "src/utils/track"
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
