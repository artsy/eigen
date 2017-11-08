import React from "react"
import _track, { Track as _Track } from "react-tracking"

// tslint:disable-next-line:no-namespace
export namespace Schema {
  /**
   * The global tracking-info keys in Artsy’s schema.
   */
  export interface Global {
    /**
     * The name of an event.
     */
    action: string

    /**
     * The root container component should specify this as the screen context.
     */
    page: string
  }

  export interface Entity extends Global {
    /**
     * The ID of the entity in its database. E.g. the Mongo ID for entities that reside in Gravity.
     */
    entity_id: string

    /**
     * The public slug for this entity.
     */
    entity_slug: string
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
