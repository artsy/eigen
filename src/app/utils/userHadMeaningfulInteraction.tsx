import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { PromptForReview } from "@artsy/cohesion/dist/Schema/Events/PromptForReview"
import { getCurrentEmissionState } from "app/store/GlobalStore"
import { Platform } from "react-native"
import InAppReview from "react-native-in-app-review"
import { postEventToProviders } from "./track/providers"

// Whether we have requested during the current session or not.
let hasRequested = false
/**
 * Callback for when user has meaningfully interacted with the app (eg: followed an artist).
 * This method is designed to be called often, and it encapsulates all logic necessary for
 * deciding whether or not to prompt the user for an app rating.
 */
export async function userHadMeaningfulInteraction({
  contextModule,
  contextOwnerType,
  contextOwnerId,
  contextOwnerSlug,
}: {
  contextModule: ContextModule
  contextOwnerType: OwnerType
  contextOwnerId?: string
  contextOwnerSlug?: string
}) {
  const launchCount = getCurrentEmissionState().launchCount

  // We choose to ask the user on their second session, as well as their 22nd, 42nd, etc.
  // Apple will only ever ask the user to rate the app 3 times in a year, and we want to
  // space out how often we ask for a rating so users have gotten a sense of the app's value.
  if (launchCount % 20 === 2 && launchCount !== 2) {
    if (!hasRequested) {
      hasRequested = true
      try {
        postEventToProviders(
          tracks.promptForReview({
            contextModule,
            contextOwnerType,
            contextOwnerSlug,
            contextOwnerId,
          })
        )
        await InAppReview.RequestInAppReview()
      } catch (error) {
        console.log("something went wrong while prompting for review")
        console.log(error)
      }
    }
  }
}

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
