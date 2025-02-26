import { Flex, Join, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { ScrollView, TouchableOpacity } from "react-native"

export const DarkModeSettings: React.FC<{}> = () => {
  const darkModeOption = GlobalStore.useAppState((state) => state.devicePrefs.darkModeOption)
  const setDarkModeOption = GlobalStore.actions.devicePrefs.setDarkModeOption

  return (
    <ScrollView>
      <Flex px={2} mt={2}>
        <Join separator={<Spacer y={2} />}>
          <RadioMenuItem
            title="Sync with system"
            selected={darkModeOption === "system"}
            onPress={() => {
              setDarkModeOption("system")
            }}
          />
          <RadioMenuItem
            title="On"
            selected={darkModeOption === "on"}
            onPress={() => {
              setDarkModeOption("on")
            }}
          />
          <RadioMenuItem
            title="Off"
            selected={darkModeOption === "off"}
            onPress={() => {
              setDarkModeOption("off")
            }}
          />
        </Join>
      </Flex>
    </ScrollView>
  )
}

const RadioMenuItem: React.FC<{
  title: string
  selected: boolean
  onPress: () => void
}> = ({ title, selected, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Flex flexDirection="row" alignItems="center">
        <Flex flex={1}>
          <Text variant="sm-display">{title}</Text>
        </Flex>
        <Flex width={40} alignItems="flex-end">
          <RadioButton selected={selected} />
        </Flex>
      </Flex>
    </TouchableOpacity>
  )
}
