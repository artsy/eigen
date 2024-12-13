import { Button, Flex, InfoCircleIcon, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import React, { useState } from "react"
import { ScrollView } from "react-native"

interface InfoButtonProps {
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
        <Flex pb={4} pt={1} height="100%">
          <Text mx={2} variant="lg-display">
            {modalTitle ?? title}
          </Text>

          <Spacer y={2} />

          <Flex flex={1}>
            <ScrollView>
              <Flex px={2}>{modalContent}</Flex>
            </ScrollView>
          </Flex>
          <Spacer y={2} />

          <Flex px={2}>
            <Button variant="outline" block onPress={() => setModalVisible(false)}>
              Close
            </Button>
          </Flex>
        </Flex>
      </AutoHeightBottomSheet>
    </>
  )
}
