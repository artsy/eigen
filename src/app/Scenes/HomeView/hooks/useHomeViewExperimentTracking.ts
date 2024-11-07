import { ExperimentViewed, ActionType, OwnerType } from "@artsy/cohesion"
import { HomeViewQuery$data } from "__generated__/HomeViewQuery.graphql"
import { HomeViewStore } from "app/Scenes/HomeView/HomeViewContext"
import { compact } from "lodash"
import { useEffect } from "react"
import { useTracking } from "react-tracking"

export function useHomeViewExperimentTracking(
  homeViewExperiments: HomeViewQuery$data["homeView"]["experiments"]
) {
  const trackedExperiments = HomeViewStore.useStoreState((state) => state.trackedExperiments)
  const addTrackedExperiment = HomeViewStore.useStoreActions(
    (actions) => actions.addTrackedExperiment
  )
  const { trackEvent } = useTracking()

  function trackViewedExperiment(name: string, variant: string) {
    const payload: ExperimentViewed = {
      action: ActionType.experimentViewed,
      experiment_name: name,
      variant_name: variant,
      context_owner_type: OwnerType.home,
      service: "unleash",
    }

    trackEvent(payload)
  }

  useEffect(() => {
    const experiments = compact(homeViewExperiments)
    experiments.forEach(({ name, variant, enabled }) => {
      if (!enabled) {
        console.warn(`Experiment is not enabled: ${name}`)
        return
      }

      if (!variant) {
        console.warn(`Experiment variant is missing for: ${name}`)
        return
      }

      if (!trackedExperiments.includes(name)) {
        trackViewedExperiment(name, variant)
        addTrackedExperiment(name)
      }
    })
  }, [homeViewExperiments])
}
