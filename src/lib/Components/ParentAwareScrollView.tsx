import PropTypes from "prop-types"
import React from "react"
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, ScrollViewProps } from "react-native"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type ScrollContext = {
  horizontal: boolean
}

// @ts-ignore
const ScrollViewContext: React.Context<ScrollContext> = ScrollView.Context

interface State {
  cellKey: string
  key: string
}

/**
 * A Component that registers self a VirtualizedList child when nested in
 * a VirtualizedList with the same orientation, thus allowing parent List
 * to forward it onScroll events
 * @returns ScrollView
 */
class ParentAwareScrollView extends React.PureComponent<ScrollViewProps, State> {
  static contextTypes = {
    virtualizedList: PropTypes.shape({
      getScrollMetrics: PropTypes.func,
      horizontal: PropTypes.bool,
      getOutermostParentListRef: PropTypes.func,
      getNestedChildState: PropTypes.func,
      registerAsNestedChild: PropTypes.func,
      unregisterAsNestedChild: PropTypes.func,
      debugInfo: PropTypes.shape({
        listKey: PropTypes.string,
        cellKey: PropTypes.string,
      }),
    }),
  }

  state = {
    cellKey: "defaultScrollListCellKey",
    key: "defaultScrollListKey",
  }

  componentDidMount() {
    if (this.isNestedInAVirtualizedListWithSameOrientation()) {
      // register as a child of the parent virtualized list
      const cellKey = this.randomString()
      const key = this.randomString()
      this.context.virtualizedList.registerAsNestedChild({
        cellKey,
        key,
        ref: this,
        parentDebugInfo: this.context.virtualizedList.debugInfo,
      })
      this.setState({ cellKey, key })
    }
  }

  componentWillUnmount() {
    if (this.isNestedInAVirtualizedListWithSameOrientation()) {
      this.context.virtualizedList.unregisterAsNestedChild({
        key: this.state.key,
        state: null,
      })
    }
  }

  randomString = (): string => [...Array(10)].map(() => Math.random().toString(36)[2]).join("")

  isNestedInAVirtualizedListWithSameOrientation = (): boolean => {
    const virtualizedListContext = this.context?.virtualizedList
    return !!(virtualizedListContext && virtualizedListContext.horizontal === (this.props.horizontal ?? false))
  }

  // The following methods are required by any parent VirtualizedList
  // in order to interact with this component as it would with a
  // child VirtualizedList

  recordInteraction = () => {
    // Do not recalculate viewability based on this component
    // as this component is not a VirtualizedList
    return
  }

  measureLayoutRelativeToContainingList() {
    // If we want to nest another VirtualizedList inside this Component
    // For now we will return a ScrollView because Artworks cannot be
    // rendered in a List like a FlatList
    return
  }

  hasMore() {
    // a scrollview wouldn't have more as everything is rendered at once
    return false
  }

  _onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (this.props.onScroll) {
      this.props.onScroll(e)
    }
  }

  _onScrollBeginDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (this.props.onScrollBeginDrag) {
      this.props.onScrollBeginDrag(e)
    }
  }

  render(): React.ReactNode {
    const { children, onScroll, ...otherProps } = this.props
    return (
      <ScrollViewContext.Consumer>
        {(scrollContext: ScrollContext) => {
          const isNestedInAScrollViewWithSameOrientation = !!(
            scrollContext &&
            !!scrollContext.horizontal === (otherProps.horizontal ?? false) &&
            !this.isNestedInAVirtualizedListWithSameOrientation()
          )

          if (!!__DEV__ && isNestedInAScrollViewWithSameOrientation) {
            console.warn(
              "ParentAwareScrollView is nested in another ScrollView of the same orientation. \n" +
                "However, it is not able to get the Parent's onScroll events because it " +
                "currently supports getting Parent's onScroll events only when nested in VirtualizedLists."
            )
            // TODO:- return a scrollview that is able to get it's parent's onScroll events
            // Eigen does not have need for that feature now.
            // On android this might entail building a custom NestedScrollView that implements
            // ViewTreeObserver.OnScrollChangedListener. See https://github.com/facebook/react-native/issues/8024
          }
          return <ScrollView {...otherProps}>{children}</ScrollView>
        }}
      </ScrollViewContext.Consumer>
    )
  }
}

export default ParentAwareScrollView
