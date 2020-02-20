import React from "react"
import { ThemeProvider } from "styled-components/native"
import { theme } from "../Elements/Theme"

export class BiddingThemeProvider extends React.Component {
  render() {
    return <ThemeProvider theme={theme} {...this.props} />
  }
}
