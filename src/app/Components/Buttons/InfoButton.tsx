import {
  Button,
  Flex,
  InfoCircleIcon,
  Spacer,
  Text,
  Touchable,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import React, { useState } from "react"

// Necessary screen margin to still see the complete modal on the screen
const TOP_SCREEN_MARGIN = 120

interface InfoButtonProps {
  maxModalHeight?: number
  modalContent: JSX.Element
  modalTitle?: string
  onPress?: () => void
  subTitle?: string
  title?: string
  titleElement?: JSX.Element
  trackEvent?: () => void
}

export const InfoButton: React.FC<InfoButtonProps> = ({
  modalContent,
  modalTitle,
  onPress,
  subTitle,
  title,
  titleElement,
  trackEvent,
}) => {
  const [modalVisible, setModalVisible] = useState(false)

  const { height: screenHeight } = useScreenDimensions()

  return (
    <>
      <Touchable
        onPress={() => {
          setModalVisible(true)
          trackEvent?.()
          onPress?.()
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Flex flexDirection="row" alignItems="center">
          {titleElement ? (
            titleElement
          ) : (
            <Text variant="sm" mr={0.5}>
              {title}
            </Text>
          )}

          <InfoCircleIcon fill="black60" />
        </Flex>
      </Touchable>

      {!!subTitle && (
        <Text variant="xs" color="black60">
          {subTitle}
        </Text>
      )}

      <AutoHeightBottomSheet visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <Flex mx={2} mb={4} mt={1} maxHeight={screenHeight - TOP_SCREEN_MARGIN}>
          <Text variant="lg-display">{modalTitle ?? title}</Text>

          <Spacer y={2} />

          {modalContent}

          <Spacer y={2} />

          <Button variant="outline" block onPress={() => setModalVisible(false)}>
            Close
          </Button>
        </Flex>
      </AutoHeightBottomSheet>
    </>
  )
}
