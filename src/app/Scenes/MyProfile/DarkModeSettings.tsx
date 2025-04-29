import { Flex, Join, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ScrollView, TouchableOpacity } from "react-native"
import { MyProfileScreenWrapper } from "./Components/MyProfileScreenWrapper"

export const DarkModeSettings: React.FC<{}> = () => {
  const darkModeOption = GlobalStore.useAppState((state) => state.devicePrefs.darkModeOption)
  const setDarkModeOption = GlobalStore.actions.devicePrefs.setDarkModeOption
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  const content = (
    <Flex px={2}>
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
  )

  if (enableRedesignedSettings) {
    return (
      <MyProfileScreenWrapper title="Dark Mode" contentContainerStyle={{ paddingHorizontal: 0 }}>
        {content}
      </MyProfileScreenWrapper>
    )
  }

  return (
    <ScrollView>
      <Spacer y={2} />
      {content}
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
          <RadioButton selected={selected} onPress={onPress} />
        </Flex>
      </Flex>
    </TouchableOpacity>
  )
}
