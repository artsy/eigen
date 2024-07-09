import {
  useCompleteMyProfileSteps_collectorProfile$key,
  useCompleteMyProfileSteps_collectorProfile$data,
} from "__generated__/useCompleteMyProfileSteps_collectorProfile.graphql"
import { Routes } from "app/Scenes/CompleteMyProfile/CompleteMyProfile"
import { useCallback, useMemo } from "react"
import { graphql, useFragment } from "react-relay"

interface useCompleteMyProfileStepsProps {
  collectorProfile?: useCompleteMyProfileSteps_collectorProfile$key | null
}

export const useCompleteMyProfileSteps = ({ collectorProfile }: useCompleteMyProfileStepsProps) => {
  const data = useFragment(fragment, collectorProfile)

  const steps = useMemo(() => getSteps(data), [data])

  const nextRoute = useCallback((currentStep: Routes) => getNextRoute(currentStep, steps), [steps])

  return {
    nextRoute,
    steps,
  }
}

const fragment = graphql`
  fragment useCompleteMyProfileSteps_collectorProfile on Me {
    collectorProfile {
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
`

export type StepsResult = "loading" | Routes[]

const getSteps = (data?: useCompleteMyProfileSteps_collectorProfile$data | null): StepsResult => {
  if (!data?.collectorProfile) {
    return "loading"
  }

  const {
    collectorProfile: { icon, isIdentityVerified, location, profession },
  } = data

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
