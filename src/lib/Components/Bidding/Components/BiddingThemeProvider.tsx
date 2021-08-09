// TODO-PALETTE-V3 REMOVE THIS FILE
import React from "react"
import { ThemeProvider } from "styled-components/native"
import { theme } from "../Elements/Theme"

export const BiddingThemeProvider: React.FC = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>
