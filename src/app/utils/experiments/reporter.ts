import { ActionType, ContextModule, ExperimentViewed, OwnerType } from "@artsy/cohesion"
import { postEventToProviders } from "../track/providers"

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
const reportedExperimentVariants: Record<string, string> = {}
export function maybeReportExperimentVariant({
  experimentName,
  enabled,
  variantName,
  payload,
  ...rest
}: TrackVariantArgs & { enabled: boolean }) {
  const combinedValue = `${enabled}-${variantName}-${payload}`
  if (reportedExperimentVariants[experimentName] === combinedValue) {
    return
  }

  reportedExperimentVariants[experimentName] = combinedValue
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
