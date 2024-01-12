import { ActionType, ContextModule, ExperimentViewed, OwnerType } from "@artsy/cohesion"
import { postEventToProviders } from "app/utils/track/providers"

interface TrackVariantArgs {
  experimentName: string
  variantName: string
  payload?: string
  context_module?: ContextModule
  context_owner_screen: OwnerType
  context_owner_id?: string
  context_owner_slug?: string
  context_owner_type: OwnerType
}

export function reportExperimentVariant({
  experimentName,
  enabled,
  variantName,
  payload,
  ...rest
}: TrackVariantArgs & { enabled: boolean; storeContext?: boolean }) {
  if (!enabled) {
    return
  }

  postEventToProviders(tracks.experimentVariant({ experimentName, variantName, payload, ...rest }))
}

const tracks = {
  experimentVariant: ({
    experimentName,
    variantName,
    payload,
    ...rest
  }: TrackVariantArgs): ExperimentViewed => ({
    ...rest,
    action: ActionType.experimentViewed,
    experiment_name: experimentName,
    variant_name: variantName,
    payload,
    service: "unleash",
  }),
}
