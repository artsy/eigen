import { MyAccountEditPriceRangeQuery } from "__generated__/MyAccountEditPriceRangeQuery.graphql"
import { MyAccountEditPriceRange_me$data } from "__generated__/MyAccountEditPriceRange_me.graphql"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { PlaceholderBox } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Select, SelectOption } from "palette/elements/Select"
import React, { useEffect, useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import {
  MyAccountFieldEditScreen,
  MyAccountFieldEditScreenPlaceholder,
} from "./Components/MyAccountFieldEditScreen"
import { updateMyUserProfile } from "./updateMyUserProfile"

const MyAccountEditPriceRange: React.FC<{
  me: MyAccountEditPriceRange_me$data
}> = ({ me }) => {
  const [receivedError, setReceivedError] = useState<string | undefined>(undefined)
  const [priceRange, setPriceRange] = useState<string>(me.priceRange ?? "")
  const [priceRangeMax, setPriceRangeMax] = useState<number | null>(me.priceRangeMax)
  const [priceRangeMin, setPriceRangeMin] = useState<number | null>(me.priceRangeMin)

  useEffect(() => {
    setReceivedError(undefined)
  }, [priceRange])

  return (
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
      <Select
        title="Price Range"
        options={PRICE_BUCKETS}
        enableSearch={false}
        value={priceRange}
        onSelectValue={(value) => {
          setPriceRange(value)

          // We don't actually accept a priceRange,
          // so have to split it into min/max
          const [priceRangeMinFin, priceRangeMaxFin] = value.split(":").map((n) => parseInt(n, 10))

          setPriceRangeMin(priceRangeMinFin)
          setPriceRangeMax(priceRangeMaxFin)
        }}
        hasError={!!receivedError}
      />
    </MyAccountFieldEditScreen>
  )
}

const MyAccountEditPriceRangePlaceholder: React.FC<{}> = ({}) => {
  return (
    <MyAccountFieldEditScreenPlaceholder title="Price Range">
      <PlaceholderBox height={40} />
    </MyAccountFieldEditScreenPlaceholder>
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
      environment={defaultEnvironment}
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
