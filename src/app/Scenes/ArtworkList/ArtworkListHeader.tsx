import { Flex, MoreIcon, Touchable, useSpace } from "@artsy/palette-mobile"

export const ArtworkListHeader = () => {
  const space = useSpace()

  return (
    <Flex alignItems="flex-end">
      <Touchable onPress={() => console.log("Nothing for now")} style={{ height: space(6) }}>
        <MoreIcon fill="black100" width={24} height={24} mt={2} mr={2} />
      </Touchable>
    </Flex>
  )
}
