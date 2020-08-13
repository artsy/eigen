import React from "react"

export interface CollapseProps {
  open: boolean
}
/**
 * Collapse component for the web
 */
export class Collapse extends React.Component<CollapseProps> {
  wrapperModifyTimeout: ReturnType<typeof setTimeout>
  wrapperRef: HTMLDivElement | null = null

  onTransitionEnd = (ev: TransitionEvent) => {
    if (!this.wrapperRef) {
      return
    }
    // when animating open, we set the wrapper's height to an explicit pixel
    // value. When the transition ends we want to set the height back to 'auto'
    // so that if the content of the wrapper changes it's height will change too
    if (ev.propertyName === "height") {
      this.wrapperRef.style.height = this.props.open ? "auto" : "0px"
    }
  }

  componentDidMount() {
    if (!this.wrapperRef) {
      return
    }

    this.wrapperRef.addEventListener("transitionend", this.onTransitionEnd)
  }

  componentDidUpdate() {
    if (!this.wrapperRef) {
      return
    }
    if (this.props.open && this.wrapperRef.style.height !== "auto") {
      // animate opening
      // measure goal height
      const prevHeight = this.wrapperRef.style.height || "0px"
      this.wrapperRef.style.height = "auto"
      const goalheight = this.wrapperRef.offsetHeight
      this.wrapperRef.style.height = prevHeight
      // wait for a tick before setting goal height to allow transition
      this.wrapperModifyTimeout = setTimeout(() => {
        this.wrapperRef.style.height = goalheight + "px"
      }, 10)
    } else if (!this.props.open && this.wrapperRef.style.height !== "0px") {
      // animate closing
      // set the wrapper's current height explicitly
      const currentHeight = this.wrapperRef.offsetHeight
      this.wrapperRef.style.height = currentHeight + "px"
      // wait for a tick before setting it to 0 to allow transition
      this.wrapperModifyTimeout = setTimeout(() => {
        this.wrapperRef.style.height = "0px"
      }, 10)
    }
  }

  componentWillUnmount() {
    this.wrapperRef.removeEventListener("transitionend", this.onTransitionEnd)
    clearTimeout(this.wrapperModifyTimeout)
  }

  // this is set until the first time `open` changes
  // then it becomes null. This helps us with SSR.
  firstRender: { open: boolean } | null = {
    open: this.props.open,
  }

  render() {
    const { children, open } = this.props
    // render explicit height before first change, so SSR works properly.
    // Thereafter we control the height property entirely in componentDidMount
    // (which doesn't get called during SSR)
    let heightProps = {}
    if (this.firstRender) {
      // render() might be called multiple times before the first time `open` changes
      if (this.firstRender.open !== open) {
        // `open` prop has changed for the first time
        // ditch explicit height and let `componentDidUpdate` take the wheel
        this.firstRender = null
      } else {
        heightProps = {
          height: open ? "auto" : "0px",
        }
      }
    }
    return (
      <div
        ref={ref => (this.wrapperRef = ref)}
        style={{
          transition: "height 0.3s ease",
          overflow: "hidden",
          ...heightProps,
        }}
      >
        {children}
      </div>
    )
  }
}
