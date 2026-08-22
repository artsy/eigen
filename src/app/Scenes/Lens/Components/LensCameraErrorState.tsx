import { Flex, Text } from "@artsy/palette-mobile"

/**
 * Rendered as the *surface* behind the header/button chrome when the camera device fails to
 * initialize (see LensCamera.tsx's screen composition) — not a standalone screen. Adapted from
 * the deleted 2022 `CameraErrorState.tsx`, which used a full `LegacyScreen` of its own; here the
 * header and library-picker fallback are always present, so this only needs to fill the middle.
 */
export const LensCameraErrorState: React.FC = () => {
  return (
    <Flex flex={1} bg="mono100" justifyContent="center" alignItems="center" px={4}>
      <Text variant="sm-display" color="mono0" textAlign="center">
        Failed to open the camera device
      </Text>
      <Text variant="xs" color="mono30" textAlign="center" mt={1}>
        You can still search using a photo from your library.
      </Text>
    </Flex>
  )
}
