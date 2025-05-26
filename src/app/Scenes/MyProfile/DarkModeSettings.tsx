import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Join, RadioButton, Spacer, Text } from "@artsy/palette-mobile"
import { DarkModeOption } from "app/Scenes/MyProfile/DevicePrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { TouchableOpacity } from "react-native"
import { useTracking } from "react-tracking"
import { MyProfileScreenWrapper } from "./Components/MyProfileScreenWrapper"

export const DARK_MODE_OPTIONS = {
  on: {
    title: "On",
    value: "on",
  },
  off: {
    title: "Off",
    value: "off",
  },
  system: {
    title: "Sync with system",
    value: "system",
  },
}

export const DarkModeSettings: React.FC<{}> = () => {
  const darkModeOption = GlobalStore.useAppState((state) => state.devicePrefs.darkModeOption)
  const setDarkModeOption = GlobalStore.actions.devicePrefs.setDarkModeOption
  const { trackEvent } = useTracking()

  const trackDarkMode = (option: DarkModeOption) => {
    trackEvent({
      action: ActionType.darkModeOptionUpdated,
      context_module: ContextModule.accountSettings,
      context_screen_owner_type: OwnerType.accountDarkMode,
      dark_mode_option: option,
    })
  }

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.accountDarkMode,
      })}
    >
      <MyProfileScreenWrapper title="Dark Mode" contentContainerStyle={{ paddingHorizontal: 0 }}>
        <Flex px={2}>
          <Join separator={<Spacer y={2} />}>
            <RadioMenuItem
              title={DARK_MODE_OPTIONS.system.title}
              selected={darkModeOption === "system"}
              onPress={() => {
                setDarkModeOption("system")
                trackDarkMode("system")
              }}
            />
            <RadioMenuItem
              title={DARK_MODE_OPTIONS.on.title}
              selected={darkModeOption === "on"}
              onPress={() => {
                setDarkModeOption("on")
                trackDarkMode("on")
              }}
            />
            <RadioMenuItem
              title={DARK_MODE_OPTIONS.off.title}
              selected={darkModeOption === "off"}
              onPress={() => {
                setDarkModeOption("off")
                trackDarkMode("off")
              }}
            />
          </Join>
        </Flex>
      </MyProfileScreenWrapper>
    </ProvideScreenTrackingWithCohesionSchema>
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
