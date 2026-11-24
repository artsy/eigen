import { ActionType, ClickedShareButton, ContextModule, OwnerType } from "@artsy/cohesion"
import { HeaderMenuArtworkListEntity } from "./types"

export const tracks = {
  clickedShareButton: (entity: HeaderMenuArtworkListEntity): ClickedShareButton => ({
    action: ActionType.clickedShareButton,
    context_module: ContextModule.saves,
    context_owner_type: OwnerType.saves,
    context_owner_id: entity.internalID,
    context_owner_slug: entity.slug ?? undefined,
  }),
}
