/* tslint:disable:completed-docs */

import styles, { ThemeProvider as WebThemeProvider } from "styled-components"

export const styled = {
  Image: styles.img,
  Text: styles.div,
  View: styles.div,
}

export const View = "div"
export const Text = "div"
export const Image = "img"

export const ThemeProvider = WebThemeProvider
export const styledWrapper = styles as typeof styles
