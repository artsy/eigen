import { Flex, Text } from "@artsy/palette-mobile"

export const LensCameraErrorState: React.FC = () => {
  return (
    <Flex flex={1} bg="mono100" justifyContent="center" alignItems="center" px={4}>
      <Text variant="sm-display" color="mono0" textAlign="center">
        Failed to open the camera
      </Text>
      <Text variant="xs" color="mono30" textAlign="center" mt={1}>
        You can still search using a photo from your library.
      </Text>
    </Flex>
  )
}
