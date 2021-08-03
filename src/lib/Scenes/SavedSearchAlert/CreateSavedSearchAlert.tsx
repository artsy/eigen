import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Box, Text } from "palette"
import React from "react"

interface CreateSavedSearchAlertProps {
  visible: boolean
  onClosePress: () => void
}

export const CreateSavedSearchAlert: React.FC<CreateSavedSearchAlertProps> = (props) => {
  const { visible, onClosePress } = props

  return (
    <FancyModal visible={visible} fullScreen>
      <FancyModalHeader useXButton hideBottomDivider onLeftButtonPress={onClosePress} />
      <Box mx={2}>
        <Text>Create alert screen</Text>
      </Box>
    </FancyModal>
  )
}
