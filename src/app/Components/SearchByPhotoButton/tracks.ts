import {
  ActionType,
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  TappedSearchByImage,
} from "@artsy/cohesion"

export const tappedSearchByImage = ({
  contextModule,
  contextScreenOwnerType,
  type,
}: {
  contextModule: ContextModule
  contextScreenOwnerType: ScreenOwnerType
  type: TappedSearchByImage["type"]
}): TappedSearchByImage => ({
  action: ActionType.tappedSearchByImage,
  context_module: contextModule,
  context_screen_owner_type: contextScreenOwnerType,
  destination_screen_owner_type: OwnerType.searchByImage,
  type,
})
