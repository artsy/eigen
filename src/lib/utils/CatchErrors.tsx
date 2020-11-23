import React from "react"

// Test util for logging async render errors in tests
export class CatchErrors extends React.Component {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  static getDerivedStateFromError(error) {
    console.log("ERROR", error)
  }
  render() {
    return this.props.children
  }
}
