import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { FC } from "react"

interface ManageArtworkListMenuProps {
  label: string
  onPress: () => void
}

export const ManageArtworkListMenuItem: FC<ManageArtworkListMenuProps> = ({ label, onPress }) => {
  return (
    <Touchable onPress={onPress}>
      <Flex p={2}>
        <Text variant="sm-display">{label}</Text>
      </Flex>
    </Touchable>
  )
}
