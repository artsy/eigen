import {
  useProfileCompletion_collectorProfile$data,
  useProfileCompletion_collectorProfile$key,
} from "__generated__/useProfileCompletion_collectorProfile.graphql"
import { useCallback, useMemo } from "react"
import { graphql, useFragment } from "react-relay"

interface useProfileCompletionProps {
  collectorProfile?: useProfileCompletion_collectorProfile$key | null
}

export const useProfileCompletion = ({ collectorProfile }: useProfileCompletionProps) => {
  const data = useFragment(fragment, collectorProfile)

  const steps = useMemo(() => getSteps(data), [data])

  const nextRoute = useCallback((currentStep: Step) => getNextRoute(currentStep, steps), [steps])

  return {
    nextRoute,
    steps,
  }
}

const fragment = graphql`
  fragment useProfileCompletion_collectorProfile on Me {
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

export type Step = "LOCATION" | "PROFESSION" | "AVATAR" | "IDENTITY_VERIFICATION"

type Loading = "loading"

export type StepsResult = Loading | Step[]

const getSteps = (data?: useProfileCompletion_collectorProfile$data | null): StepsResult => {
  if (!data?.collectorProfile) {
    return "loading"
  }

  const {
    collectorProfile: { icon, isIdentityVerified, location, profession },
  } = data

  const steps: Step[] = []

  if (!location?.display) {
    steps.push("LOCATION")
  }

  if (!profession) {
    steps.push("PROFESSION")
  }

  if (!icon?.url) {
    steps.push("AVATAR")
  }

  if (!isIdentityVerified) {
    steps.push("IDENTITY_VERIFICATION")
  }

  return steps
}

// Routes section

const Routes = [
  "CompleteMyProfileLocation",
  "CompleteMyProfileProfession",
  "CompleteMyProfileAvatar",
  "CompleteMyProfileIdentityVerification",
] as const

export type RoutePath = (typeof Routes)[number]
export type Route = RoutePath | "loading" | "none"

const routesMap: Record<Step, RoutePath> = {
  LOCATION: "CompleteMyProfileLocation",
  PROFESSION: "CompleteMyProfileProfession",
  AVATAR: "CompleteMyProfileAvatar",
  IDENTITY_VERIFICATION: "CompleteMyProfileIdentityVerification",
}

export const getNextRoute = (currentStep: Step, steps: StepsResult) => {
  if (steps === "loading" || !steps.includes(currentStep)) {
    return "none"
  }

  if (steps.indexOf(currentStep) === steps.length - 1) {
    return "none"
  }

  return routesMap[steps[steps.indexOf(currentStep) + 1]]
}
