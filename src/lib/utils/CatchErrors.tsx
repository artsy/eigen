import React from "react"

// Test util for logging async render errors in tests
export class CatchErrors extends React.Component {
  static getDerivedStateFromError(error) {
    console.warn("ERROR", error)
  }
  render() {
    return this.props.children
  }
}
