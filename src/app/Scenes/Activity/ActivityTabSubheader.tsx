import { navigate } from "app/navigation/navigate"
import { Button, Flex, Text } from "palette"
import { NotificationType } from "./types"

interface SubheaderEntity {
  title: string
  buttonLabel?: string
}

interface ActivityTabSubheaderProps {
  type: NotificationType
}

export const ActivityTabSubheader: React.FC<ActivityTabSubheaderProps> = ({ type }) => {
  const entity = entityByType[type]

  const handleButtonPress = () => {
    if (type === "alerts") {
      navigate("/my-profile/saved-search-alerts")
    }
  }

  if (!entity) {
    return null
  }

  return (
    <Flex my={2} flexDirection="row" justifyContent="space-between">
      <Text variant="lg-display">{entity.title}</Text>

      {!!entity.buttonLabel && (
        <Button size="small" onPress={handleButtonPress}>
          {entity.buttonLabel}
        </Button>
      )}
    </Flex>
  )
}

const entityByType: Record<NotificationType, SubheaderEntity> = {
  all: {
    title: "All",
  },
  alerts: {
    title: "Alerts",
    buttonLabel: "Manage alerts",
  },
}
