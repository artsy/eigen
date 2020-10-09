import { Flex, InfoCircleIcon, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"

interface InfoButtonProps {
  title: string
  subTitle?: string
  onPress?: () => void
}

export const InfoButton: React.FC<InfoButtonProps> = ({ title, subTitle, onPress }) => {
  return (
    <>
      <Flex flexDirection="row">
        <Text variant="mediumText" mr={0.5}>
          {title}
        </Text>
        {!!onPress && (
          <TouchableOpacity onPress={onPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <InfoCircleIcon style={{ top: 2 }} color="black60" />
          </TouchableOpacity>
        )}
      </Flex>
      <Text color="black60">{subTitle}</Text>
    </>
  )
}
