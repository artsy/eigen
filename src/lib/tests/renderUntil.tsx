import { mount, ReactWrapper, RenderUntilPredicate } from "enzyme"
import * as React from "react"

function renderUntil<P = {}, S = {}, C extends React.Component = React.Component>(
  this: ReactWrapper,
  predicate: RenderUntilPredicate<P, S, C>
) {
  return new Promise<ReactWrapper<P, S, C>>(resolve => {
    /**
     * Continuously lets JS/React continue doing its async work and then check
     * if the callback matches what the user expects, in which case the tree is
     * ready to be asserted on.
     */
    const wait = () => {
      if (predicate(this)) {
        resolve(this)
      } else {
        setImmediate(() => {
          /**
           * Except for after the initial render, we need to make sure the
           * tree gets re-rendered to reflect any changes caused by props or
           * state changes.
           */
          this.update()
          wait()
        })
      }
    }
    /**
     * Start recursive waiting process.
     */
    wait()
  })
}

// TODO: Depending on this discussion move this upstream
// https://github.com/airbnb/enzyme/issues/1878.
ReactWrapper.prototype.renderUntil = renderUntil

/**
 * @deprecated Use {@link ReactWrapper.prototype.renderUntil} instead.
 */
function deprecated_renderUntil<P = {}, S = {}, C extends React.Component = React.Component>(
  until: RenderUntilPredicate<P, S, C>,
  element: React.ReactElement<P>
) {
  /**
   * In case of an uncaught error, be sure to reject the promise ASAP and
   * with a helpful error.
   */
  const tree = mount<C, P, S>(element)
  return tree.renderUntil(until)
}

export { deprecated_renderUntil as renderUntil }
