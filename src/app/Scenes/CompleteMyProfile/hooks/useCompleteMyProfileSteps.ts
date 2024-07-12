import {
  useCompleteMyProfileStepsQuery,
  useCompleteMyProfileStepsQuery$data,
} from "__generated__/useCompleteMyProfileStepsQuery.graphql"
import { Routes } from "app/Scenes/CompleteMyProfile/CompleteMyProfile"
import { useCallback, useMemo } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const useCompleteMyProfileSteps = () => {
  const data = useLazyLoadQuery<useCompleteMyProfileStepsQuery>(
    query,
    {},
    {
      fetchPolicy: "store-or-network",
    }
  )

  const steps = useMemo(() => getSteps(data), [data])

  const nextRoute = useCallback((currentStep: Routes) => getNextRoute(currentStep, steps), [steps])

  return {
    nextRoute,
    steps,
    me: data?.me,
  }
}

const query = graphql`
  query useCompleteMyProfileStepsQuery {
    me @required(action: NONE) {
      ...ImageSelector_me
      ...IdentityVerificationStep_me

      collectorProfile @required(action: NONE) {
        icon {
          url(version: "thumbnail")
        }
        profession
        location {
          display
        }
        isIdentityVerified
      }
    }
  }
`

export type StepsResult = "loading" | Routes[]

const getSteps = (data?: useCompleteMyProfileStepsQuery$data | null): StepsResult => {
  if (!data?.me.collectorProfile) {
    return "loading"
  }

  const {
    collectorProfile: { icon, isIdentityVerified, location, profession },
  } = data.me

  const steps: Routes[] = []

  if (!location?.display) {
    steps.push("LocationStep")
  }

  if (!profession) {
    steps.push("ProfessionStep")
  }

  if (!icon?.url) {
    steps.push("AvatarStep")
  }

  if (!isIdentityVerified) {
    steps.push("IdentityVerificationStep")
  }

  if (steps.length > 0) {
    steps.push("ChangesSummary")
  }

  return steps
}

export const getNextRoute = (currentStep: Routes, steps: StepsResult) => {
  if (steps === "loading" || !steps.includes(currentStep)) {
    return "none"
  }

  if (steps.indexOf(currentStep) === steps.length - 1) {
    return "none"
  }

  return steps[steps.indexOf(currentStep) + 1]
}
