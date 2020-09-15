import { Sale_sale$key } from "__generated__/Sale_sale.graphql"
import { SaleQueryRendererQuery } from "__generated__/SaleQueryRendererQuery.graphql"
import Spinner from "lib/Components/Spinner"
import React, { useRef } from "react"
import { Animated } from "react-native"
import { graphql } from "react-relay"
import { useFragment, useQuery } from "relay-hooks"
import { SaleHeader } from "./Components/SaleHeader"

interface Props {
  sale: Sale_sale$key
}

export const Sale: React.FC<Props> = (props) => {
  const sale = useFragment(SaleFragmentSpec, props.sale)
  const scrollAnim = useRef(new Animated.Value(0)).current
  return (
    <Animated.ScrollView
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { y: scrollAnim },
            },
          },
        ],
        {
          useNativeDriver: true,
        }
      )}
      scrollEventThrottle={16}
    >
      <SaleHeader sale={sale} scrollAnim={scrollAnim} />
    </Animated.ScrollView>
  )
}

const SaleFragmentSpec = graphql`
  fragment Sale_sale on Sale {
    name
    liveStartAt
    endAt
    startAt
    timeZone
    coverImage {
      url
    }
  }
`

const Placeholder = () => <Spinner style={{ flex: 1 }} />

export const SaleQueryRenderer: React.FC<{ saleID: string }> = ({ saleID }) => {
  const { props, error } = useQuery<SaleQueryRendererQuery>(
    graphql`
      query SaleQueryRendererQuery($saleID: String!) {
        sale(id: $saleID) {
          ...Sale_sale
        }
      }
    `,
    { saleID }
  )
  if (props) {
    return <Sale sale={props.sale!} />
  }
  if (error) {
    throw error
  }

  return <Placeholder />
}
