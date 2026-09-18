import {
  ActionType,
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  TappedArtAssistant,
} from "@artsy/cohesion"

export const tappedArtAssistant = ({
  contextModule,
  contextScreenOwnerType,
  type,
}: {
  contextModule: ContextModule
  contextScreenOwnerType: ScreenOwnerType
  type: TappedArtAssistant["type"]
}): TappedArtAssistant => ({
  action: ActionType.tappedArtAssistant,
  context_module: contextModule,
  context_screen_owner_type: contextScreenOwnerType,
  destination_screen_owner_type: OwnerType.artAssistant,
  type,
})
