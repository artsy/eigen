import { CloseIcon, Flex, Text, useSpace } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"

interface ArtworkFilterOptionsHeaderProps {
  title: string
  isClearAllButtonEnabled: boolean
  onClosePress: () => void
  onClearAllPress: () => void
}

export const ArtworkFilterOptionsHeader: React.FC<ArtworkFilterOptionsHeaderProps> = (props) => {
  const { title, isClearAllButtonEnabled, onClosePress, onClearAllPress } = props
  const space = useSpace()

  return (
    <Flex flexGrow={0} flexDirection="row" justifyContent="space-between" alignItems="center" height={space(6)}>
      <Flex flex={1} alignItems="center">
        <Text variant="sm">{title}</Text>
      </Flex>

      <Flex position="absolute" alignItems="flex-start">
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ padding: space(2) }}
          onPress={onClosePress}
        >
          <CloseIcon fill="black100" />
        </TouchableOpacity>
      </Flex>

      <Flex position="absolute" right={0} alignItems="flex-end">
        <TouchableOpacity style={{ padding: space(2) }} disabled={!isClearAllButtonEnabled} onPress={onClearAllPress}>
          <Text variant="sm" color={isClearAllButtonEnabled ? "black100" : "black30"}>
            Clear all
          </Text>
        </TouchableOpacity>
      </Flex>
    </Flex>
  )
}
