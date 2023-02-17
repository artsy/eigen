import { CloseIcon, Spacer, Box, Text } from "@artsy/palette-mobile"
import { popToRoot } from "app/system/navigation/navigate"
import { Button } from "palette"
import { FancyModal } from "./FancyModal/FancyModal"
import { FancyModalHeader } from "./FancyModal/FancyModalHeader"

interface AbandonFlowModalProps {
  isVisible: boolean
  title: string
  subtitle: string
  leaveButtonTitle: string
  continueButtonTitle: string
  onDismiss: () => void
}

export const AbandonFlowModal: React.FC<AbandonFlowModalProps> = ({
  isVisible,
  title,
  subtitle,
  leaveButtonTitle,
  continueButtonTitle,
  onDismiss,
}) => {
  return (
    <FancyModal visible={isVisible}>
      <FancyModalHeader
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
        <Button onPress={() => popToRoot()} block variant="fillDark" size="large">
          {leaveButtonTitle}
        </Button>
        <Spacer y={1} />
        <Button onPress={onDismiss} block variant="outline" size="large">
          {continueButtonTitle}
        </Button>
      </Box>
    </FancyModal>
  )
}
