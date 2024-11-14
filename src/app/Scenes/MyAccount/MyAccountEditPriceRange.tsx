import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { MyAccountEditPriceRangeQuery } from "__generated__/MyAccountEditPriceRangeQuery.graphql"
import { MyAccountEditPriceRange_me$data } from "__generated__/MyAccountEditPriceRange_me.graphql"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { Select, SelectOption } from "app/Components/Select"
import { MyAccountFieldEditScreen } from "app/Scenes/MyAccount/Components/MyAccountFieldEditScreen"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { PlaceholderBox } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import React, { Fragment, useEffect, useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { updateMyUserProfile } from "./updateMyUserProfile"

const MyAccountEditPriceRange: React.FC<{
  me: MyAccountEditPriceRange_me$data
}> = ({ me }) => {
  const navigation = useNavigation()
  const enableNewNavigation = useFeatureFlag("AREnableNewNavigation")

  const [receivedError, setReceivedError] = useState<string | undefined>(undefined)
  const [priceRange, setPriceRange] = useState<string>(me.priceRange ?? "")
  const [priceRangeMax, setPriceRangeMax] = useState<number | null | undefined>(me.priceRangeMax)
  const [priceRangeMin, setPriceRangeMin] = useState<number | null | undefined>(me.priceRangeMin)

  useEffect(() => {
    setReceivedError(undefined)
  }, [priceRange])

  useEffect(() => {
    const isValid = !!priceRange && priceRange !== me.priceRange

    navigation.setOptions({
      headerRight: () => {
        return (
          <Touchable onPress={handleSave} disabled={!isValid}>
            <Text variant="xs" color={!!isValid ? "black100" : "black60"}>
              Save
            </Text>
          </Touchable>
        )
      },
    })
  }, [navigation, priceRange, me.priceRange])

  const handleSave = async () => {
    try {
      await updateMyUserProfile({ priceRangeMin, priceRangeMax })
      goBack()
    } catch (e: any) {
      setReceivedError(e)
    }
  }

  const Wrapper = enableNewNavigation
    ? Fragment
    : ({ children }: { children: React.ReactNode }) => (
        <MyAccountFieldEditScreen
          title="Price Range"
          canSave={!!priceRange && priceRange !== me.priceRange}
          onSave={async (dismiss) => {
            try {
              await updateMyUserProfile({ priceRangeMin, priceRangeMax })
              dismiss()
            } catch (e: any) {
              setReceivedError(e)
            }
          }}
        >
          {children}
        </MyAccountFieldEditScreen>
      )

  return (
    <Wrapper>
      <Flex p={enableNewNavigation ? 2 : 0}>
        <Select
          title="Price Range"
          options={PRICE_BUCKETS}
          enableSearch={false}
          value={priceRange}
          onSelectValue={(value) => {
            setPriceRange(value)

            // We don't actually accept a priceRange,
            // so have to split it into min/max
            const [priceRangeMinFin, priceRangeMaxFin] = value
              .split(":")
              .map((n) => parseInt(n, 10))

            setPriceRangeMin(priceRangeMinFin)
            setPriceRangeMax(priceRangeMaxFin)
          }}
          hasError={!!receivedError}
        />
      </Flex>
    </Wrapper>
  )
}

const MyAccountEditPriceRangePlaceholder: React.FC<{}> = ({}) => {
  const enableNewNavigation = useFeatureFlag("AREnableNewNavigation")
  const Wrapper = enableNewNavigation
    ? Fragment
    : ({ children }: { children: React.ReactNode }) => (
        <PageWithSimpleHeader title="Price Range">{children}</PageWithSimpleHeader>
      )

  return (
    <Wrapper>
      <PlaceholderBox height={40} />
    </Wrapper>
  )
}

export const MyAccountEditPriceRangeContainer = createFragmentContainer(MyAccountEditPriceRange, {
  me: graphql`
    fragment MyAccountEditPriceRange_me on Me {
      priceRange
      priceRangeMin
      priceRangeMax
    }
  `,
})

export const MyAccountEditPriceRangeQueryRenderer: React.FC<{}> = () => {
  return (
    <QueryRenderer<MyAccountEditPriceRangeQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query MyAccountEditPriceRangeQuery {
          me {
            ...MyAccountEditPriceRange_me
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MyAccountEditPriceRangeContainer,
        renderPlaceholder: () => <MyAccountEditPriceRangePlaceholder />,
      })}
      variables={{}}
    />
  )
}

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
