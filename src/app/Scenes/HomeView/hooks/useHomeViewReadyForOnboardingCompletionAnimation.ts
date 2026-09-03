import { GlobalStore } from "app/store/GlobalStore"
import { useEffect, useRef } from "react"

export function useHomeViewReadyForOnboardingCompletionAnimation() {
  const newUserOnboardingGoalReached = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.newUserOnboardingGoalReached
  )

  useEffect(() => {
    // mark HomeView as no longer ready for the onboarding completion animation when it unmounts
    return () => {
      GlobalStore.actions.bottomTabs.setIsHomeViewReadyForOnboardingCompletionAnimation(false)
    }
  }, [])

  // ensures HomeView is only marked ready for the onboarding completion animation once per mount
  const hasSignaledHomeViewReadyRef = useRef(false)

  const onLayout = () => {
    if (!newUserOnboardingGoalReached || hasSignaledHomeViewReadyRef.current) return
    hasSignaledHomeViewReadyRef.current = true
    // wait two frames before marking HomeView ready, to let the layout actually paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        GlobalStore.actions.bottomTabs.setIsHomeViewReadyForOnboardingCompletionAnimation(true)
      })
    })
  }

  return { onLayout }
}
