import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "app/Scenes/MyCollection/Components/ScreenMargin"
import { Flex, InfoCircleIcon, Text } from "palette"
import React, { useState } from "react"
import { TouchableOpacity } from "react-native"

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
  maxModalHeight,
  modalContent,
  modalTitle,
  onPress,
  subTitle,
  title,
  titleElement,
  trackEvent,
}) => {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <Flex flexDirection="row" alignItems="center">
        {titleElement ? (
          titleElement
        ) : (
          <Text variant="sm" mr={0.5}>
            {title}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true)
            trackEvent?.()
            onPress?.()
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <InfoCircleIcon fill="black60" />
        </TouchableOpacity>
      </Flex>
      {!!subTitle && <Text color="black60">{subTitle}</Text>}
      <FancyModal
        visible={modalVisible}
        maxHeight={maxModalHeight}
        onBackgroundPressed={() => setModalVisible(false)}
      >
        <FancyModalHeader useXButton onLeftButtonPress={() => setModalVisible(false)}>
          {modalTitle ?? title}
        </FancyModalHeader>
        <ScreenMargin>{modalContent}</ScreenMargin>
      </FancyModal>
    </>
  )
}
