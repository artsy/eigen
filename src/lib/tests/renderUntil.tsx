import { mount, ReactWrapper, RenderUntilPredicate } from "enzyme"
import * as React from "react"
import { waitUntil } from "./waitUntil"

function renderUntil<P = {}, S = {}, C extends React.Component = React.Component>(
  this: ReactWrapper,
  predicate: RenderUntilPredicate<P, S, C>
) {
  return waitUntil(() => {
    if (!predicate(this)) {
      this.update()
      return false
    }
    return true
  }).then<ReactWrapper<P, S, C>>(() => this)
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
