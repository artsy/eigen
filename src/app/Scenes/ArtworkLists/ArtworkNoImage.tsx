import { Flex, NoImageIcon } from "@artsy/palette-mobile"

const NO_ICON_SIZE = 18
const IMAGE_SIZE = 78

export const ArtworkNoImage = () => {
  return (
    <Flex
      bg="black5"
      width={IMAGE_SIZE}
      height={IMAGE_SIZE}
      justifyContent="center"
      alignItems="center"
      borderWidth={1}
      borderColor="black15"
    >
      <NoImageIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="black60" />
    </Flex>
  )
}
