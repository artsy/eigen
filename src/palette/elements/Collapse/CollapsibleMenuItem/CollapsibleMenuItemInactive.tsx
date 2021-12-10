import { track as _track } from "lib/utils/track"
import { Sans } from "palette"
import { ArrowDownIcon } from "palette"
import React from "react"
import { StyleSheet, View } from "react-native"

interface Props {
  title: string
  step: number
  totalSteps: number
}

export const CollapsibleMenuItemInactive: React.FC<Props> = ({ title, step, totalSteps }) => {
  return (
    <View style={styles.container}>
      <Sans size="1" color="black30">
        Step {step} of {totalSteps}
      </Sans>
      <View style={styles.titleAndIcon}>
        <Sans size="8" color="black30">
          {title}
        </Sans>
        <View style={styles.icons}>
          <ArrowDownIcon fill="black30" />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { paddingLeft: 20, paddingRight: 20 },
  titleAndIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 20,
  },
  icons: { flexDirection: "row", alignItems: "center" },
  circle: { marginRight: 5 },
})
