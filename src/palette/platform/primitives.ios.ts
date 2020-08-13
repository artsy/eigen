/* tslint:disable:completed-docs */

import styles, {
  ThemeProvider as NativeThemeProvider,
} from "styled-components/native"

export const styled = {
  Image: styles.Image,
  Text: styles.Text,
  View: styles.View,
}

export const View = "View"
export const Text = "Text"
export const Image = "Image"

export const ThemeProvider = NativeThemeProvider
export const styledWrapper = styles as typeof styles
