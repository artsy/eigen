import { Color } from "@artsy/palette-mobile"
import { Spinner as PaletteSpinner } from "palette"
import { StyleSheet, View, ViewProps } from "react-native"

interface Props extends ViewProps {
  spinnerColor?: Color
  size?: "small" | "medium" | "large"
}

const Spinner: React.FC<Props> = ({ spinnerColor = "black100", size = "large", ...props }) => {
  return (
    <View style={[props.style, styles.container]} testID={props.testID}>
      <PaletteSpinner color={spinnerColor} size={size} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default Spinner
