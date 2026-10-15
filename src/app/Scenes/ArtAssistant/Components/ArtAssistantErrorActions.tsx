import { Button, Flex } from "@artsy/palette-mobile"
import {
  ART_ASSISTANT_ERRORS,
  ArtAssistantErrorAction,
  ArtAssistantErrorKind,
} from "app/Scenes/ArtAssistant/utils/artAssistantErrors"

interface ArtAssistantErrorActionsProps {
  error: ArtAssistantErrorKind
  onSelect: (action: ArtAssistantErrorAction) => void
}

export const ArtAssistantErrorActions: React.FC<ArtAssistantErrorActionsProps> = ({
  error,
  onSelect,
}) => {
  const { actions } = ART_ASSISTANT_ERRORS[error]

  if (actions.length === 0) {
    return null
  }

  return (
    <Flex flexDirection="row" flexWrap="wrap" gap={1} testID="art-assistant-error-actions">
      {actions.map(({ action, label }) => (
        <Button key={action} onPress={() => onSelect(action)} size="small" variant="outline">
          {label}
        </Button>
      ))}
    </Flex>
  )
}
