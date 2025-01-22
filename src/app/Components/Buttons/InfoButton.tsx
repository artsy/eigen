import {
  Button,
  Flex,
  InfoCircleIcon,
  Spacer,
  Text,
  Touchable,
  useSpace,
} from "@artsy/palette-mobile"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import React, { forwardRef, useImperativeHandle, useState } from "react"
import { Platform, ScrollView } from "react-native"
import { FullWindowOverlay } from "react-native-screens"

interface InfoButtonProps {
  modalContent: JSX.Element
  modalTitle?: string
  onPress?: () => void
  subTitle?: string
  title?: string
  titleElement?: JSX.Element
  trackEvent?: () => void
}

export const InfoButton = forwardRef<
  {
    closeModal: () => void
  },
  InfoButtonProps
>(({ modalContent, modalTitle, onPress, subTitle, title, titleElement, trackEvent }, ref) => {
  const [modalVisible, setModalVisible] = useState(false)

  // Expose closeModal function via the ref
  useImperativeHandle(ref, () => ({
    closeModal: () => setModalVisible(false),
  }))

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

      <AutoHeightInfoModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        modalTitle={modalTitle}
        title={title}
        modalContent={modalContent}
      />
    </>
  )
})

export const AutoHeightInfoModal: React.FC<{
  visible: boolean
  onDismiss: () => void
  modalTitle?: string
  title?: string
  modalContent: JSX.Element
}> = ({ visible, onDismiss, modalTitle, title, modalContent }) => {
  const space = useSpace()

  return (
    <AutoHeightBottomSheet
      visible={visible}
      onDismiss={onDismiss}
      containerComponent={
        Platform.OS === "ios"
          ? ({ children }) => <FullWindowOverlay>{children}</FullWindowOverlay>
          : undefined
      }
    >
      <Flex pb={4} pt={1}>
        <Text mx={2} variant="lg-display">
          {modalTitle ?? title}
        </Text>

        <Spacer y={2} />

        <ScrollView contentContainerStyle={{ paddingHorizontal: space(2) }}>
          {modalContent}
        </ScrollView>

        <Spacer y={2} />

        <Flex px={2}>
          <Button variant="outline" block onPress={onDismiss}>
            Close
          </Button>
        </Flex>
      </Flex>
    </AutoHeightBottomSheet>
  )
}
