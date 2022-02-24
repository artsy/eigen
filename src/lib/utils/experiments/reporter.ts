import { ContextModule, OwnerType } from "@artsy/cohesion"
import { postEventToProviders } from "../track/providers"

const reportedExperimentFlags: Record<string, boolean> = {}
export function maybeReportExperimentFlag({
  name,
  enabled,
  ...rest
}: Parameters<typeof tracks["experimentFlag"]>[0]) {
  if (reportedExperimentFlags[name] === enabled) {
    return
  }

  reportedExperimentFlags[name] = enabled
  postEventToProviders(tracks.experimentFlag({ name, enabled, ...rest }))
}

const reportedExperimentVariants: Record<string, string> = {}
export function maybeReportExperimentVariant({
  name,
  enabled,
  variant,
  payload,
  ...rest
}: Parameters<typeof tracks["experimentVariant"]>[0]) {
  const combinedValue = `${enabled}-${variant}-${payload}`
  if (reportedExperimentVariants[name] === combinedValue) {
    return
  }

  reportedExperimentVariants[name] = combinedValue
  postEventToProviders(tracks.experimentVariant({ name, enabled, variant, payload, ...rest }))
}

// this is not on cohesion yet, so the schema might change
const tracks = {
  experimentFlag: ({
    name,
    enabled,
    ...rest
  }: {
    name: string
    enabled: boolean
    context_module?: ContextModule
    context_screen_owner_type?: OwnerType
    context_screen: string
    context_page_owner_id?: string
    context_page_owner_slug?: string
    context_page_owner_type?: string
  }) => ({
    action: "experiment_viewed",
    nonInteraction: 1,
    ...rest,
    experiment_id: name,
    experiment_name: name,
    variation_id: enabled,
    variation_name: enabled,
  }),
  experimentVariant: ({
    name,
    enabled,
    variant,
    payload,
    ...rest
  }: {
    name: string
    enabled: boolean
    variant: string
    payload?: string
    context_module?: ContextModule
    context_screen_owner_type?: OwnerType
    context_screen: string
    context_page_owner_id?: string
    context_page_owner_slug?: string
    context_page_owner_type?: string
  }) => ({
    action: "experiment_viewed",
    nonInteraction: 1,
    ...rest,
    experiment_id: name,
    experiment_name: name,
    variation_id: enabled ? variant : false,
    variation_name: enabled ? variant : false,
    // payload,
  }),
}
