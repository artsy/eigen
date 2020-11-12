import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { AppStore } from "lib/store/AppStore"
import { Flex, Text } from "palette"
import React from "react"
import { SegmentedControlIOS } from "react-native"
import { DarkModeOption } from "./SettingsModel"

const values: DarkModeOption[] = ["light", "dark", "system"]

export const DarkModeSettings: React.FC = () => {
  const value = AppStore.useAppState((state) => state.settings.darkMode)
  const setValue = (option: DarkModeOption) => {
    AppStore.actions.settings.setDarkMode(option)
  }

  return (
    <PageWithSimpleHeader title="Dark mode settings">
      <Text variant="title" mt="2" textAlign="center">
        Choose your destiny
      </Text>
      <Flex mx="2" mt="2">
        <SegmentedControlIOS
          values={values}
          selectedIndex={values.indexOf(value)}
          onValueChange={(v) => setValue(v as DarkModeOption)}
        />
      </Flex>
    </PageWithSimpleHeader>
  )
}
