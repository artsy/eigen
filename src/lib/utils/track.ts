import * as React from "react"
import { default as _track, Track } from "react-tracking"

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
export const track = createTrack<Schema.Global>()

/**
 * Creates a typed alias of the react-tracking `track` function.
 *
 * Use this when you don’t use a callback function to generate the tracking-info, but do want to extend the schema.
 *
 * @example
 *
 *      ```ts
 *      import { createTrack, Schema } from "src/utils/track"
 *
 *      interface Shareable extends Schema.Global {
 *        slug: string
 *      }
 *
 *      const track = createTrack<Shareable>()
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
 *        @track({ action: "Follow Artist", slug: "banksy" })
 *        handleFollow() {
 *          // ...
 *        }
 *      }
 *      ```
 */
export function createTrack<T extends Schema.Global>(): Track<T, any, any>

/**
 * Creates a typed alias of the react-tracking `track` function.
 *
 * Use this when you’re going to use a callback function to generate the tracking-info based on props.
 *
 * You can optionally specify an extended tracking-info schema.
 *
 * @example
 *
 *      ```ts
 *      import { createTrack } from "src/utils/track"
 *
 *      interface Props {
 *        artist: {
 *          name: string
 *        }
 *      }
 *
 *      const track = createTrack<Props>()
 *
 *      @track()
 *      class Artist extends React.Component<Props, null> {
 *        render() {
 *          return (
 *            <div onClick={this.handleFollow.bind(this)}>
 *              ...
 *            </div>
 *          )
 *        }
 *
 *        @track(props => ({ action: `Follow ${props.artist.name}` }))
 *        handleFollow() {
 *          // ...
 *        }
 *      }
 *      ```
 */
export function createTrack<P, T extends Schema.Global = Schema.Global>(): Track<T, P>

/**
 * Creates a typed alias of the react-tracking `track` function.
 *
 * Use this when you’re going to use a callback function to generate the tracking-info based on props and state.
 *
 * You can optionally specify an extended tracking-info schema.
 *
 * @example
 *
 *      ```ts
 *      import { createTrack } from "src/utils/track"
 *
 *      interface Props {
 *        artist: {
 *          name: string
 *        }
 *      }
 *
 *      interface State {
 *        following: boolean
 *      }
 *
 *      const track = createTrack<Props, State>()
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
 *        @track((props, state) => ({ action: `${state.following ? "Unfollow" : "Follow"} ${props.artist.name}` }))
 *        handleFollow() {
 *          // ...
 *        }
 *      }
 *      ```
 */
export function createTrack<P, S, T extends Schema.Global = Schema.Global>(): Track<T, P, S>

/**
 * This is the actual implementation, but all the signatures are specified above. This function doesn’t do anything at
 * runtime other than returning the default react-tracking `track` function.
 *
 * It exists solely to be able to cast the `track` function with one of the above signatures.
 */
export function createTrack() {
  return _track
}
