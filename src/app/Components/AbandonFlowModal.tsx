import { CloseIcon } from "@artsy/icons/native"
import { Box, Button, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { popToRoot } from "app/system/navigation/navigate"
import { Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface AbandonFlowModalProps {
  isVisible: boolean
  title: string
  subtitle: string
  leaveButtonTitle: string
  continueButtonTitle: string
  onDismiss: () => void
  onLeave?: () => void
}

export const AbandonFlowModal: React.FC<AbandonFlowModalProps> = ({
  isVisible,
  title,
  subtitle,
  leaveButtonTitle,
  continueButtonTitle,
  onDismiss,
  onLeave,
}) => {
  const color = useColor()

  return (
    <Modal visible={isVisible} presentationStyle="pageSheet" animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: color("background") }}>
        <NavigationHeader
          hideBottomDivider
          renderRightButton={() => <CloseIcon width={26} height={26} />}
          onRightButtonPress={onDismiss}
        />
        <Box px={2}>
          <Text variant="lg-display" mb={2}>
            {title}
          </Text>
          <Text variant="sm-display" mb={4}>
            {subtitle}
          </Text>
          <Button
            onPress={() => {
              if (onLeave) {
                onLeave()
                return
              }
              // not sure why we pop to root instead of just going back here
              popToRoot()
            }}
            block
            variant="fillDark"
            size="large"
          >
            {leaveButtonTitle}
          </Button>
          <Spacer y={1} />
          <Button onPress={onDismiss} block variant="outline" size="large">
            {continueButtonTitle}
          </Button>
        </Box>
      </SafeAreaView>
    </Modal>
  )
}
