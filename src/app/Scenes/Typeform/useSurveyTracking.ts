import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { useTracking } from "react-tracking"

// TODO: move event/property definitions to @artsy/cohesion

interface SurveyViewedEvent {
  action: ActionType
  context_screen_owner_type: OwnerType
  survey_id: string
  context_module?: string
}

interface SurveySubmittedEvent {
  action: ActionType
  context_screen_owner_type: OwnerType
  survey_id: string
  context_module?: string
}

interface SurveyAbandonedEvent {
  action: ActionType
  context_screen_owner_type: OwnerType
  survey_id: string
  context_module?: string
}

export const useSurveyTracking = () => {
  const { trackEvent } = useTracking()

  const trackSurveyViewed = (surveyId: string, contextModule?: ContextModule) => {
    const payload: SurveyViewedEvent = {
      action: "surveyViewed" as ActionType,
      context_screen_owner_type: "survey" as OwnerType,
      survey_id: surveyId,
      ...(contextModule && { context_module: contextModule }),
    }

    trackEvent(payload)
  }

  const trackSurveySubmitted = (surveyId: string, contextModule?: string) => {
    const payload: SurveySubmittedEvent = {
      action: "surveySubmitted" as ActionType,
      context_screen_owner_type: "survey" as OwnerType,
      survey_id: surveyId,
      ...(contextModule && { context_module: contextModule }),
    }

    trackEvent(payload)
  }

  const trackSurveyAbandoned = (surveyId: string, contextModule?: string) => {
    const payload: SurveyAbandonedEvent = {
      action: "surveyAbandoned" as ActionType,
      context_screen_owner_type: "survey" as OwnerType,
      survey_id: surveyId,
      ...(contextModule && { context_module: contextModule }),
    }

    trackEvent(payload)
  }

  return {
    trackSurveyViewed,
    trackSurveySubmitted,
    trackSurveyAbandoned,
  }
}
