import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

/** LightFM ranking needs a signed-in user's taste vector; everyone else keeps date order. */
export const useShowsForYou = () => {
  const enabled = useFeatureFlag("AREnableCityGuideShowsForYou")
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)

  return enabled && isLoggedIn
}
