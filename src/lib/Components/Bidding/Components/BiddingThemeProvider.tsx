import React from "react"
// @ts-ignore STRICTNESS_MIGRATION
import { ThemeProvider } from "styled-components/native"
import { theme } from "../Elements/Theme"

export class BiddingThemeProvider extends React.Component {
  render() {
    return <ThemeProvider theme={theme} {...this.props} />
  }
}
