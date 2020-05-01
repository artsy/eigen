import { color } from "@artsy/palette"
import React, { useState } from "react"
import { Switch, View } from "react-native"

export const ToggleButton = () => {
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false)

  const handleToggle = () => {
    setIsSwitchEnabled(!isSwitchEnabled)
  }

  return (
    <View>
      <Switch
        trackColor={{ false: color("black10"), true: color("black100") }}
        onValueChange={handleToggle}
        value={isSwitchEnabled}
      />
    </View>
  )
}
