import { OwnerType } from "@artsy/cohesion"
import { CloseIcon, EditIcon } from "@artsy/icons/native"
import { Button, DEFAULT_HIT_SLOP, Screen, Touchable } from "@artsy/palette-mobile"
import { ArtAssistantConversation } from "app/Scenes/ArtAssistant/Components/ArtAssistantConversation"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"

interface ArtAssistantProps {
  initialPrompt?: string
  sendInitialPrompt?: boolean
  onClose?: () => void
}

export const ArtAssistant: React.FC<ArtAssistantProps> = ({
  initialPrompt,
  sendInitialPrompt,
  onClose = goBack,
}) => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.artAssistant })}
    >
      <Screen>
        <ArtAssistantConversation
          initialPrompt={initialPrompt}
          sendInitialPrompt={sendInitialPrompt}
          onClose={onClose}
          renderHeader={({ hasMessages, onNewChat }) => (
            <Screen.Header
              hideTitle
              hideLeftElements={!hasMessages}
              leftElements={
                <Button
                  accessibilityLabel="Start a new chat"
                  icon={<EditIcon />}
                  onPress={onNewChat}
                  size="small"
                  variant="outline"
                >
                  New
                </Button>
              }
              rightElements={
                <Touchable
                  accessibilityLabel="Close Art Assistant"
                  accessibilityRole="button"
                  hitSlop={DEFAULT_HIT_SLOP}
                  onPress={() => onClose()}
                  underlayColor="transparent"
                >
                  <CloseIcon fill="mono100" />
                </Touchable>
              }
            />
          )}
        />
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
