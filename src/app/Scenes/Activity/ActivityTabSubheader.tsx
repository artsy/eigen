import { Button, Flex, Text } from "palette"

interface ActivityTabSubheaderProps {
  label: string
  button?: {
    label: string
    onPress: () => void
  }
}

export const ActivityTabSubheader: React.FC<ActivityTabSubheaderProps> = ({ label, button }) => {
  return (
    <Flex my={2} flexDirection="row" justifyContent="space-between">
      <Text variant="lg">{label}</Text>

      {!!button && (
        <Button size="small" onPress={button.onPress}>
          {button.label}
        </Button>
      )}
    </Flex>
  )
}
