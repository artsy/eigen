import React from "react"
import { View } from "react-native"
import { animated, Spring } from "react-spring/renderprops-native.cjs"

const AnimatedView = animated(View)

export interface CollapseProps {
  /** Determines whether content is expanded or collapsed */
  open: boolean
  /**
   * If we're rendering within a statically-sized component (e.g. FlatList), we need
   * to propagate a sentinel value in order to trigger re-render or re-measure.
   */
  onAnimationFrame: (animateValue: { height: number }) => void
}

interface State {
  isMounted: boolean
  hasMeasured: boolean
  isMeasuring: boolean
  isAnimating: boolean
  measuredHeight?: number
}

/** Collapses content with animation when open is not true */
export class Collapse extends React.Component<CollapseProps, State> {
  measureRef: View

  state: State = {
    isMounted: false,
    isMeasuring: false,
    isAnimating: false,
    hasMeasured: false,
  }

  componentDidMount() {
    this.setState({ isMounted: true })
  }

  handleMeasureRef = ref => {
    this.measureRef = ref
  }

  measureChildren = () => {
    this.setState({ isMeasuring: true }, () => {
      requestAnimationFrame(() => {
        if (!this.measureRef) {
          this.setState({
            isMeasuring: false,
          })
          return
        }

        // @ts-ignore
        this.measureRef.measure((x, y, width, height) => {
          this.setState({
            isMeasuring: false,
            hasMeasured: true,
            measuredHeight: height,
          })
        })
      })
    })
  }

  handleLayout = ev => {
    const { open } = this.props
    const { hasMeasured, isMeasuring, measuredHeight, isAnimating } = this.state
    const height = ev.nativeEvent.layout.height
    if (
      !hasMeasured ||
      !open ||
      isMeasuring ||
      measuredHeight === height ||
      isAnimating
    ) {
      return
    }
    this.setState({
      measuredHeight: height,
    })
  }

  handleFrame = animatedValue => {
    if (this.props.onAnimationFrame) {
      this.props.onAnimationFrame(animatedValue)
    }
  }

  componentWillReceiveProps(nextProps) {
    const willExpand = nextProps.open && !this.props.open
    if (nextProps.open !== this.props.open) {
      this.setState({ isAnimating: true }, () => {
        if (willExpand && !this.measureRef && this.state.hasMeasured) {
          // We've previously measured children and can animate without further work.
          return
        } else if (!this.state.hasMeasured) {
          // Children are ready to measure, measureRef might be mounted already.
          this.measureChildren()
        }
      })
    }
  }

  measureView = () => (
    <View
      ref={this.handleMeasureRef}
      style={{ opacity: 0, position: "absolute" }}
    >
      {this.props.children}
    </View>
  )

  render() {
    const { isMeasuring, isMounted, measuredHeight } = this.state
    const { open, children } = this.props

    // We must render children once in order to measure and derive a static height for animation.
    if (isMeasuring) {
      return this.measureView()
    }

    return (
      <Spring
        native
        immediate={!isMounted}
        from={{ height: 0 }}
        to={{ height: open && measuredHeight ? measuredHeight : 0 }}
        onRest={() => {
          this.setState({ isAnimating: false })
        }}
        onFrame={this.handleFrame}
      >
        {props => (
          <AnimatedView
            style={{ ...props, overflow: "hidden" }}
            onLayout={this.handleLayout}
          >
            {children}
          </AnimatedView>
        )}
      </Spring>
    )
  }
}
