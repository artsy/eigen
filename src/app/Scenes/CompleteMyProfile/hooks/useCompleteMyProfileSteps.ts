import { useCompleteMyProfileSteps_me$data } from "__generated__/useCompleteMyProfileSteps_me.graphql"
import { Routes } from "app/Scenes/CompleteMyProfile/CompleteMyProfile"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { useCallback, useMemo } from "react"
import { graphql, useFragment } from "react-relay"

export const useCompleteMyProfileSteps = () => {
  const meKey = CompleteMyProfileStore.useStoreState((state) => state.meKey)
  // Fragment reasoning: to keep the store in sync avoiding dealing with updates from lazy load
  // and keeping the me record consistent and updated from the mutations used by my-profile routes
  const data = useFragment(fragment, meKey)

  const steps = useMemo(() => getSteps(data), [data])

  const nextRoute = useCallback((currentStep: Routes) => getNextRoute(currentStep, steps), [steps])

  return {
    nextRoute,
    steps,
    me: data,
  }
}

const fragment = graphql`
  fragment useCompleteMyProfileSteps_me on Me {
    ...ImageSelector_me
    ...IdentityVerificationStep_me

    icon {
      url(version: "thumbnail")
    }
    profession
    location {
      display
    }
    isIdentityVerified
  }
`

export type StepsResult = "loading" | Routes[]

const getSteps = (data?: useCompleteMyProfileSteps_me$data | null): StepsResult => {
  if (!data) {
    return "loading"
  }

  const { icon, isIdentityVerified, location, profession } = data

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
