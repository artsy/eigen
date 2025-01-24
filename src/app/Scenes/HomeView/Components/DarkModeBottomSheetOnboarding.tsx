import { Button, Flex, LinkText, Spacer, Text } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { useDarkModeOnboarding } from "app/Scenes/HomeView/hooks/useNewFeatureOnboarding"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate, switchTab } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const DarkModeBottomSheetOnboarding = () => {
  const supportsDarkMode = useFeatureFlag("ARDarkModeSupport")
  const { isVisible: isDarkModeOnboardingVisible } = useDarkModeOnboarding()
  const { seenFeatures } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  if (!supportsDarkMode || seenFeatures.includes("dark-mode")) {
    return null
  }

  const dismissModal = () => {
    GlobalStore.actions.progressiveOnboarding.addSeenFeature("dark-mode")
  }

  return (
    <AutomountedBottomSheetModal visible={isDarkModeOnboardingVisible} onDismiss={dismissModal}>
      <BottomSheetView>
        <Flex p={2} pt={2}>
          <Text variant="lg-display" color="black100">
            Try out Dark Mode <Text color="blue100">beta</Text>
          </Text>

          <Spacer y={2} />

          <Text variant="sm-display" color="black100">
            Our dark mode is now live! You can try it out by enabling dark mode in your{" "}
            <LinkText
              onPress={() => {
                dismissModal()

                requestAnimationFrame(() => {
                  switchTab("profile")
                  requestAnimationFrame(() => {
                    navigate("/my-profile/settings")
                    requestAnimationFrame(() => {
                      navigate("/settings/dark-mode")
                    })
                  })
                })
              }}
            >
              Profile settings.
            </LinkText>
          </Text>

          <Spacer y={2} />

          <Button variant="outline" block onPress={dismissModal}>
            Dismiss
          </Button>

          <Spacer y={2} />
        </Flex>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
