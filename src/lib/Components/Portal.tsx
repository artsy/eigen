import React from "react"

const PortalContext = React.createContext({})

interface PortalProviderProps {
  children: React.ReactNode
}

/**
 * Provides a `onSetPortalChildren` function available in Context that children `Portals`
 * can use to render "out of tree" and relative to the `PortalProvider` rather than their
 * immediate parent. This is primarily to workaround differences in RN's `absolute`
 * positioning, namely that Children can only be positioned relative to their immediate parent.
 *
 * React-based overlays and modals can use this to render over other components, though
 * `ReactNative.Modal` should be preferred whenever possible.
 */
export class PortalProvider extends React.Component<PortalProviderProps> {
  state = { portalChildren: null }

  /**
   * We deliberately do not handle multiple child portals within a single
   * portal provider - each Portal will destructively update the children to
   * render.
   */
  handleSetPortalChildren = children => {
    this.setState({ portalChildren: children })
  }

  render() {
    const { children } = this.props
    const { portalChildren } = this.state

    const providerValues = {
      onSetPortalChildren: this.handleSetPortalChildren,
    }

    return (
      <PortalContext.Provider value={providerValues}>
        {children}
        {portalChildren}
      </PortalContext.Provider>
    )
  }
}

interface InnerPortalProps {
  onSetPortalChildren: (children: React.ReactNode) => void
}

class InnerPortal extends React.Component<InnerPortalProps> {
  componentDidMount() {
    if (!this.props.onSetPortalChildren) {
      console.error("Portal needs a PortalProvider in the tree order to render.")
    }

    this.props.onSetPortalChildren(this.props.children)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.children !== nextProps.children) {
      this.props.onSetPortalChildren(nextProps.children)
    }
  }

  componentWillUnmount() {
    this.props.onSetPortalChildren(null)
  }

  render() {
    return null
  }
}

/**
 * Portal's children will be rendered as children of the ancestor PortalProvider
 * rather than the Portal component itself.
 */
export const Portal = ({ children }) => (
  <PortalContext.Consumer>
    {props => <InnerPortal {...props as InnerPortalProps}>{children}</InnerPortal>}
  </PortalContext.Consumer>
)
