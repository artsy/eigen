import PropTypes from "prop-types"
import React from "react"
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, ScrollViewProps } from "react-native"

interface State {
  cellKey: string
  key: string
}

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
    if (this._isNestedInAVirtualizedListWithSameOrientation()) {
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
    if (this._isNestedInAVirtualizedListWithSameOrientation()) {
      this.context.virtualizedList.unregisterAsNestedChild({
        key: this.state.key,
        state: null,
      })
    }
  }

  recordInteraction = () => null

  measureLayoutRelativeToContainingList() {
    // Not expecting this component nor it's children to be used as a cell
  }

  hasMore() {
    // a scrollview wouldn't have more and this is not a real virtualized list
    return false
  }

  _isNestedInAVirtualizedListWithSameOrientation = (): boolean => {
    const virtualizedListContext = this.context?.virtualizedList
    return !!(virtualizedListContext && virtualizedListContext.horizontal === (this.props.horizontal ?? false))
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

  randomString = (): string => [...Array(10)].map(() => Math.random().toString(36)[2]).join("")

  render(): React.ReactNode {
    const { children, onScroll, ...otherProps } = this.props
    return (
      <ScrollView.Context.Consumer>
        {(scrollContext: any) => {
          // is nested in a scrollview if we can get a scrollview context
          // TODO:- Implement logic for Parent Scrollview forwarding events
          // to nested ScrollView if nestedScrollEnabled prop is present
          const isNestedInAScrollViewWithSameOrientation = !!(
            scrollContext && !!scrollContext.horizontal === (otherProps.horizontal ?? false)
          )

          return <ScrollView {...otherProps}>{children}</ScrollView>
        }}
      </ScrollView.Context.Consumer>
    )
  }
}

export default ParentAwareScrollView
