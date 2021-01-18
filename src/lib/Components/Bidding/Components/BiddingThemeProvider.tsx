import React from "react"
import { ThemeProvider } from "styled-components/native"
import { theme } from "../Elements/Theme"

export const BiddingThemeProvider: React.FC = (props) => <ThemeProvider theme={theme} {...props} />
