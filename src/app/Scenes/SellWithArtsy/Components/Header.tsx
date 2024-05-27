import { ArrowRightIcon, Flex, Spacer, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { useScreenDimensions } from "app/utils/hooks"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Alert, Image, LayoutAnimation } from "react-native"
import { isTablet } from "react-native-device-info"

export const Header: React.FC = () => {
  const { width } = useScreenDimensions()
  const space = useSpace()
  const enableSaveAndContinue = useFeatureFlag("AREnableSaveAndContinueSubmission")
  const { draft } = GlobalStore.useAppState((state) => state.artworkSubmission)

  const showContinueSubmission = !!enableSaveAndContinue && !!draft?.submissionID

  return (
    <Flex>
      <Image
        source={require("images/swa-landing-page-header.webp")}
        style={{ width: isTablet() ? "100%" : width, height: isTablet() ? 480 : 340 }}
        resizeMode={isTablet() ? "contain" : "cover"}
      />

      {!!showContinueSubmission && (
        <>
          <Spacer y={2} />

          <Touchable
            style={{ paddingHorizontal: space(2), flex: 1 }}
            onPress={() => {
              navigate(
                `/sell/submissions/${draft.submissionID}/edit?initialStep=${draft.currentStep}`
              )
            }}
            onLongPress={() => {
              Alert.alert(
                "Discard draft",
                "Are you sure you want to discard your draft? This action cannot be undone.",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Disard Draft",
                    onPress: () => {
                      GlobalStore.actions.artworkSubmission.setDraft(null)
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                    },
                    style: "destructive",
                  },
                ]
              )
            }}
          >
            <Flex backgroundColor="blue100" px={2} py={1} flex={1} flexDirection="row">
              <Text variant="sm-display" color="white" style={{ flex: 1 }}>
                Continue previous submission
              </Text>
              <ArrowRightIcon fill="white100" height={18} width={18} />
            </Flex>
          </Touchable>
        </>
      )}

      <Spacer y={showContinueSubmission ? 1 : 2} />

      <Flex mx={2}>
        <Text variant="xl" mb={1}>
          Sell art from your collection
        </Text>
        <Text variant="xs">
          With our global reach and art market expertise, our specialists will find the best sales
          option for your work.
        </Text>
      </Flex>
    </Flex>
  )
}
