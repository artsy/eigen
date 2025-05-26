import { OwnerType } from "@artsy/cohesion"
import { MyProfilePreferencesQuery } from "__generated__/MyProfilePreferencesQuery.graphql"
import { MyProfilePreferences_me$key } from "__generated__/MyProfilePreferences_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { MenuItem } from "app/Components/MenuItem"
import { PRICE_BUCKETS } from "app/Scenes/MyAccount/MyAccountEditPriceRange"
import { DARK_MODE_OPTIONS } from "app/Scenes/MyProfile/DarkModeSettings"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { MyProfileScreenWrapper } from "./Components/MyProfileScreenWrapper"

export const MyProfilePreferences = (props: { me?: MyProfilePreferences_me$key }) => {
  const supportsDarkMode = useFeatureFlag("ARDarkModeSupport")
  const data = useFragment(myProfilePreferencesFragment, props.me)
  const darkModeOption = GlobalStore.useAppState((state) => state.devicePrefs.darkModeOption)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.accountPreferences,
      })}
    >
      <MyProfileScreenWrapper title="Preferences" contentContainerStyle={{ paddingHorizontal: 0 }}>
        <MenuItem
          title="Price Range"
          value={PRICE_BUCKETS.find((bucket) => bucket.value === data?.priceRange)?.label}
          onPress={() => {
            navigate("/my-account/edit-price-range")
          }}
        />
        {!!supportsDarkMode && (
          <MenuItem
            title="Dark Mode"
            value={DARK_MODE_OPTIONS[darkModeOption].title}
            onPress={() => {
              navigate("/settings/dark-mode")
            }}
          />
        )}
      </MyProfileScreenWrapper>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const myProfilePreferencesFragment = graphql`
  fragment MyProfilePreferences_me on Me {
    priceRange
    priceRangeMin
    priceRangeMax
  }
`

export const myProfilePreferencesQuery = graphql`
  query MyProfilePreferencesQuery {
    me {
      ...MyProfilePreferences_me
    }
  }
`

export const MyProfilePreferencesQueryRenderer: React.FC<{}> = withSuspense({
  Component: ({}) => {
    const data = useLazyLoadQuery<MyProfilePreferencesQuery>(myProfilePreferencesQuery, {})

    if (!data?.me) {
      return null
    }

    return <MyProfilePreferences me={data?.me} />
  },
  LoadingFallback: MyProfilePreferences,
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        useSafeArea={false}
        error={fallbackProps.error}
        trackErrorBoundary={false}
      />
    )
  },
})
