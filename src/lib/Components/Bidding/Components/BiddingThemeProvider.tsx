import React from "react"
import { ThemeProvider } from "styled-components"
import { theme } from "../Elements/Theme"

export const BiddingThemeProvider = props => <ThemeProvider theme={theme} {...props} />
