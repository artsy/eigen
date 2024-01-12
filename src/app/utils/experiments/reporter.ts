import { ActionType, ContextModule, ExperimentViewed, OwnerType } from "@artsy/cohesion"
import { postEventToProviders } from "app/utils/track/providers"

export interface ContextProps {
  context_module?: ContextModule
  context_owner_screen?: OwnerType
  context_owner_id?: string
  context_owner_slug?: string
  context_owner_type: OwnerType
}

interface TrackVariantArgs extends ContextProps {
  experimentName: string
  variantName: string
  payload?: string
}

export function reportExperimentVariant(props: TrackVariantArgs) {
  postEventToProviders(tracks.experimentVariant(props))
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
