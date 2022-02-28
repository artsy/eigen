import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { ChevronIcon, Flex, Text, Touchable } from "palette"
import React from "react"
import { FancyModal } from "./FancyModal/FancyModal"
import { FancyModalHeader } from "./FancyModal/FancyModalHeader"

interface CustomShareSheetProps {
  visible: boolean
  setVisible: (value: boolean) => void
}

export const CustomShareSheet: React.FC<CustomShareSheetProps> = ({
  children,
  visible,
  setVisible,
}) => {
  const { height: screenHeight } = useScreenDimensions()

  return (
    <FancyModal
      maxHeight={screenHeight / 2}
      visible={visible}
      onBackgroundPressed={() => setVisible(false)}
    >
      <FancyModalHeader useXButton onLeftButtonPress={() => setVisible(false)}>
        Share
      </FancyModalHeader>
      {children}
    </FancyModal>
  )
}

interface CustomShareSheetItemProps {
  title: string
  Icon: React.ReactNode
  onPress?: () => void
}

export const CustomShareSheetItem: React.FC<CustomShareSheetItemProps> = ({
  title,
  Icon,
  onPress,
}) => (
  <Touchable onPress={onPress}>
    <Flex width="100%" height={60} flexDirection="row" alignItems="center" px="2">
      {Icon}
      <Text variant="sm" ml="2">
        {title}
      </Text>
      <Flex flex={1} />
      <ChevronIcon />
    </Flex>
  </Touchable>
)
