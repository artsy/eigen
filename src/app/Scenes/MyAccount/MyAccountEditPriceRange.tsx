import { OwnerType } from "@artsy/cohesion"
import { Text, Touchable } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { MyAccountEditPriceRangeQuery } from "__generated__/MyAccountEditPriceRangeQuery.graphql"
import { MyAccountEditPriceRange_me$key } from "__generated__/MyAccountEditPriceRange_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { Select, SelectOption } from "app/Components/Select"
import { MyProfileScreenWrapper } from "app/Scenes/MyProfile/Components/MyProfileScreenWrapper"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { PlaceholderBox } from "app/utils/placeholders"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import React, { useEffect, useState } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { updateMyUserProfile } from "./updateMyUserProfile"

export const MyAccountEditPriceRange: React.FC<{
  me: MyAccountEditPriceRange_me$key
}> = (props) => {
  const me = useFragment(meFragment, props.me)
  const [isLoading, setIsLoading] = useState(false)

  const [receivedError, setReceivedError] = useState<string | undefined>(undefined)
  const [priceRange, setPriceRange] = useState<string>(me.priceRange ?? "")
  const [priceRangeMax, setPriceRangeMax] = useState<number | null | undefined>(me.priceRangeMax)
  const [priceRangeMin, setPriceRangeMin] = useState<number | null | undefined>(me.priceRangeMin)
  const navigation = useNavigation()

  useEffect(() => {
    setReceivedError(undefined)
  }, [priceRange])

  useEffect(() => {
    const isValid = !!priceRange && priceRange !== me.priceRange

    navigation.setOptions({
      headerRight: () => {
        return (
          <Touchable accessibilityRole="button" onPress={handleSave} disabled={!isValid}>
            <Text variant="xs" color={!!isValid ? "mono100" : "mono60"}>
              Save
            </Text>
          </Touchable>
        )
      },
    })
  }, [navigation, priceRange, me.priceRange])

  const handleSave = async () => {
    try {
      setIsLoading(true)
      await updateMyUserProfile({ priceRangeMin, priceRangeMax })
      goBack()
    } catch (e: any) {
      setReceivedError(e)
    } finally {
      setIsLoading(false)
    }
  }

  const isValid = !!priceRange && priceRange !== me.priceRange

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.accountPriceRange,
      })}
    >
      <MyProfileScreenWrapper
        title="Price Range"
        onPress={handleSave}
        isValid={isValid}
        loading={isLoading}
      >
        <Select
          title="Price Range"
          options={PRICE_BUCKETS}
          enableSearch={false}
          value={priceRange}
          onSelectValue={(value) => {
            setPriceRange(value)
            const [priceRangeMinFin, priceRangeMaxFin] = value
              .split(":")
              .map((n) => parseInt(n, 10))
            setPriceRangeMin(priceRangeMinFin)
            setPriceRangeMax(priceRangeMaxFin)
          }}
          hasError={!!receivedError}
        />
      </MyProfileScreenWrapper>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const MyAccountEditPriceRangePlaceholder: React.FC<{}> = () => {
  return (
    <MyProfileScreenWrapper title="Price Range">
      <PlaceholderBox height={40} />
    </MyProfileScreenWrapper>
  )
}

const meFragment = graphql`
  fragment MyAccountEditPriceRange_me on Me {
    priceRange
    priceRangeMin
    priceRangeMax
  }
`

export const myAccountEditPriceRangeQuery = graphql`
  query MyAccountEditPriceRangeQuery {
    me {
      ...MyAccountEditPriceRange_me
    }
  }
`

export const MyAccountEditPriceRangeQueryRenderer: React.FC<{}> = withSuspense({
  Component: ({}) => {
    const data = useLazyLoadQuery<MyAccountEditPriceRangeQuery>(myAccountEditPriceRangeQuery, {})

    if (!data?.me) {
      return null
    }

    return <MyAccountEditPriceRange me={data.me} />
  },
  LoadingFallback: MyAccountEditPriceRangePlaceholder,
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

export const PRICE_BUCKETS: Array<SelectOption<string>> = [
  { label: "Select a price range", value: "" },
  { label: "Under $500", value: "-1:500" },
  { label: "Under $2,500", value: "-1:2500" },
  { label: "Under $5,000", value: "-1:5000" },
  { label: "Under $10,000", value: "-1:10000" },
  { label: "Under $25,000", value: "-1:25000" },
  { label: "Under $50,000", value: "-1:50000" },
  { label: "Under $100,000", value: "-1:100000" },
  { label: "No budget in mind", value: "-1:1000000000000" },
]
