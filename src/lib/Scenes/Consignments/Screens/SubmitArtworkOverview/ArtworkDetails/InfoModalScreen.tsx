import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { goBack } from "lib/navigation/navigate"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, Join, Spacer } from "palette"
import React from "react"
import { ScrollView } from "react-native"

interface Props {
  visible: boolean
  onDismiss: () => void
  withoutButton?: boolean
  pageTitle?: string
}

export const InfoModalScreen: React.FC<Props> = ({
  visible,
  onDismiss,
  withoutButton,
  children,
}) => {
  const { safeAreaInsets } = useScreenDimensions()
  return (
    <FancyModal fullScreen visible={visible} animationPosition="right">
      <FancyModalHeader onLeftButtonPress={onDismiss} hideBottomDivider />
      <ScrollView>
        <Box pt={safeAreaInsets.top} pb={safeAreaInsets.bottom} px={2} my={-2}>
          <Box my={0}>
            <Join separator={<Spacer my={1.5} />}>
              {children}
              {!withoutButton && (
                <Join separator={<Spacer my={1.5} />}>
                  <Button block haptic onPress={onDismiss}>
                    Close
                  </Button>
                </Join>
              )}
            </Join>
          </Box>
        </Box>
      </ScrollView>
    </FancyModal>
  )
}
