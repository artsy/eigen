import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import {
  BackButton,
  Flex,
  Join,
  RadioButton,
  Spacer,
  Text,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import { DarkModeOption } from "app/Scenes/MyProfile/DevicePrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { MotiView } from "moti"
import { ScrollView, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTracking } from "react-tracking"

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
  const space = useSpace()
  const color = useColor()

  const safeAreaInsets = useSafeAreaInsets()

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
      <MotiView
        style={{ paddingTop: safeAreaInsets.top, flex: 1 }}
        animate={{ backgroundColor: color("mono0") }}
        transition={{
          backgroundColor: {
            type: "timing",
          },
        }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          scrollEnabled={false}
          contentContainerStyle={{
            paddingTop: space(2),
            paddingHorizontal: space(2),
          }}
        >
          <BackButton onPress={goBack} style={{ marginBottom: space(2) }} />

          <Text variant="lg-display" mb={4}>
            Dark Mode
          </Text>

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
        </ScrollView>
      </MotiView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const RadioMenuItem: React.FC<{
  title: string
  selected: boolean
  onPress: () => void
}> = ({ title, selected, onPress }) => {
  return (
    <TouchableOpacity accessibilityRole="radio" onPress={onPress}>
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
