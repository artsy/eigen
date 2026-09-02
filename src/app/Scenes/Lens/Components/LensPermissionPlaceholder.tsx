import { PhotographIcon } from "@artsy/icons/native"
import { Button, Flex, Text } from "@artsy/palette-mobile"

export type LensPermissionStatus = "undetermined" | "denied"

interface LensPermissionPlaceholderProps {
  status: LensPermissionStatus
  onRequestPermission: () => void
  onOpenSettings: () => void
}

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
