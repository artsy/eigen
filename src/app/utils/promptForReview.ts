import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { PromptForReview } from "@artsy/cohesion/dist/Schema/Events/PromptForReview"
import { Platform } from "react-native"
import InAppReview from "react-native-in-app-review"
import { postEventToProviders } from "./track/providers"

export const promptForReview = ({
  contextModule,
  contextOwnerType,
  contextOwnerId,
  contextOwnerSlug,
}: {
  contextModule: ContextModule
  contextOwnerType: OwnerType
  contextOwnerId?: string
  contextOwnerSlug?: string
}) =>
  InAppReview.RequestInAppReview()
    .then((flowWasShown) => {
      if (!flowWasShown) {
        return
      }

      postEventToProviders(
        tracks.promptForReview({
          contextModule,
          contextOwnerType,
          contextOwnerId,
          contextOwnerSlug,
        })
      )
    })
    .catch(console.log)

const tracks = {
  promptForReview: ({
    contextModule,
    contextOwnerType,
    contextOwnerId,
    contextOwnerSlug,
  }: {
    contextModule: ContextModule
    contextOwnerType: OwnerType
    contextOwnerId?: string
    contextOwnerSlug?: string
  }): PromptForReview => ({
    action: ActionType.promptForReview,
    context_module: contextModule,
    context_owner_type: contextOwnerType,
    context_owner_id: contextOwnerId,
    context_owner_slug: contextOwnerSlug,
    // @ts-ignore so far we don't support web and windows
    platform: Platform.OS,
  }),
}
