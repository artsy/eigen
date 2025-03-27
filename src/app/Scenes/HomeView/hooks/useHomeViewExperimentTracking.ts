import { ActionType, ExperimentViewed, OwnerType } from "@artsy/cohesion"
import {
  useHomeViewExperimentTrackingQuery,
  useHomeViewExperimentTrackingQuery$data,
} from "__generated__/useHomeViewExperimentTrackingQuery.graphql"
import { HomeViewStore } from "app/Scenes/HomeView/HomeViewContext"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { compact } from "lodash"
import { useEffect } from "react"
import { fetchQuery, graphql } from "react-relay"
import { useTracking } from "react-tracking"

export const useHomeViewExperimentTracking = () => {
  const trackedExperiments = HomeViewStore.useStoreState((state) => state.trackedExperiments)
  const addTrackedExperiment = HomeViewStore.useStoreActions(
    (actions) => actions.addTrackedExperiment
  )
  const { trackEvent } = useTracking()

  const trackViewedExperiment = (name: string, variant: string) => {
    const payload: ExperimentViewed = {
      action: ActionType.experimentViewed,
      experiment_name: name,
      variant_name: variant,
      context_owner_type: OwnerType.home,
      service: "unleash",
    }

    trackEvent(payload)
  }

  const trackExperiments = (
    homeViewExperiments: useHomeViewExperimentTrackingQuery$data["homeView"]["experiments"]
  ) => {
    compact(homeViewExperiments).forEach(({ name, variant, enabled }) => {
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
  }

  const fetchAndTrackExperiments = async () => {
    fetchQuery<useHomeViewExperimentTrackingQuery>(
      getRelayEnvironment(),
      graphql`
        query useHomeViewExperimentTrackingQuery {
          homeView {
            experiments {
              name
              variant
              enabled
            }
          }
        }
      `,
      {}
    ).subscribe({
      error: (error: any) => {
        console.error("Unable to fetch experiments.", error)
      },
      next: (data) => {
        trackExperiments(data.homeView?.experiments)
      },
    })
  }

  useEffect(() => {
    fetchAndTrackExperiments()
  }, [])
}
