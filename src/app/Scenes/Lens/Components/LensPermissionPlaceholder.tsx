import { PhotographIcon } from "@artsy/icons/native"
import { Button, Flex, Text } from "@artsy/palette-mobile"

export type LensPermissionStatus = "undetermined" | "denied"

interface LensPermissionPlaceholderProps {
  status: LensPermissionStatus
  onRequestPermission: () => void
  onOpenSettings: () => void
}

/**
 * The surface shown behind the header/button chrome (see LensCamera.tsx) before camera access is
 * granted — modeled on Vinted's "Search with your camera" pre-permission screen rather than the
 * deleted 2022 `CameraGrantPermissions`, which dead-ended the whole screen on a bare "Grant"
 * button. The library-picker fallback stays available in this state (see LensCameraButtons.tsx),
 * so a user who never grants camera access can still complete the flow.
 *
 * The primary action's label and behavior depend on status: a second in-app permission request
 * after an iOS denial is a silent no-op, so "denied" must route to Settings instead of re-asking.
 */
export const LensPermissionPlaceholder: React.FC<LensPermissionPlaceholderProps> = (props) => {
  const { status, onRequestPermission, onOpenSettings } = props

  return (
    <Flex flex={1} bg="mono100" justifyContent="center" alignItems="center" px={4}>
      <PhotographIcon fill="mono0" width={48} height={48} />

      <Text variant="lg-display" color="mono0" textAlign="center" mt={2}>
        Search with your camera
      </Text>

      <Text variant="sm" color="mono30" textAlign="center" mt={1} mb={4}>
        Enable camera access to take a photo and find matching artworks
      </Text>

      <Button
        variant="fillLight"
        block
        onPress={status === "denied" ? onOpenSettings : onRequestPermission}
      >
        {status === "denied" ? "Go to Settings" : "Enable Access"}
      </Button>
    </Flex>
  )
}
