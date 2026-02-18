// @ts-nocheck
import React from "react"
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  VirtualizedList,
} from "react-native"

type ScrollContext = {
  horizontal: boolean
}

// @ts-expect-error
const ScrollViewContext: React.Context<ScrollContext> = ScrollView.Context

interface State {
  cellKey: string
  key: string
}

/**
 * @deprecated
 * Please do not use this component. It is only kept around for backwards compatibility.
 *
 * A ScrollView that pretends to be a VirtualizedList.
 * It registers itself as a nested child of a parent VirtualizedList (or FlatList basically).
 * Registering as a nested child causes the parent VirtualizedList to call functions on our
 * component (like `_onScroll` and `_onMomentumScrollBegin`). This allows us to hook into the scroll
 * events and trigger our own custom logic.
 *
 * Example:
 * <Flatlist
 *   data={[
 *     <ParentAwareScrollView onScroll={(e) => console.log("woop, this will be called")} />
 *   ]}
 *   renderItem={({ item }) => item}
 * />
 *
 * @returns ScrollView
 */
class ParentAwareScrollView extends React.PureComponent<ScrollViewProps, State> {
  static contextType = VirtualizedList.contextType

  state = {
    cellKey: "defaultScrollListCellKey",
    key: "defaultScrollListKey",
  }

  componentDidMount() {
    if (this.isNestedInAVirtualizedListWithSameOrientation()) {
      // register as a child of the parent virtualized list
      const cellKey = this.randomString()
      const key = this.randomString()
      this.context.registerAsNestedChild({
        cellKey,
        key,
        ref: this,
        parentDebugInfo: this.context.debugInfo,
      })
      this.setState({ cellKey, key })
    }
  }

  componentWillUnmount() {
    if (this.isNestedInAVirtualizedListWithSameOrientation()) {
      this.context.unregisterAsNestedChild({
        key: this.state.key,
        ref: this,
        state: null,
      })
    }
  }

  randomString = (): string => [...Array(10)].map(() => Math.random().toString(36)[2]).join("")

  isNestedInAVirtualizedListWithSameOrientation = (): boolean => {
    const virtualizedListContext = this.context
    return !!(
      virtualizedListContext &&
      virtualizedListContext.horizontal === (this.props.horizontal ?? false)
    )
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

  _onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => this.props.onScroll?.(e)

  _onScrollBeginDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    this.props.onScrollBeginDrag?.(e)

  _onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => this.props.onScrollEndDrag?.(e)

  _onMomentumScrollBegin = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    this.props.onMomentumScrollBegin?.(e)

  _onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    this.props.onMomentumScrollEnd?.(e)

  render(): React.ReactNode {
    const { children, ...otherProps } = this.props
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
