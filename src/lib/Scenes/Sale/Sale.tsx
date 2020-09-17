import { Sale_sale } from "__generated__/Sale_sale.graphql"
import { SaleQueryRendererQuery } from "__generated__/SaleQueryRendererQuery.graphql"
import Spinner from "lib/Components/Spinner"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Flex } from "palette"
import React, { useRef } from "react"
import { Animated } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { extractNodes } from "../../utils/extractNodes"
import { RegisterToBidButton } from "./Components/RegisterToBidButton"
import { SaleArtworksRailContainer as SaleArtworksRail } from "./Components/SaleArtworksRail"
import { SaleHeaderContainer as SaleHeader } from "./Components/SaleHeader"

interface Props {
  sale: Sale_sale
}

const Sale: React.FC<Props> = (props) => {
  const saleArtworks = extractNodes(props.sale.saleArtworksConnection)
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
      <SaleHeader sale={props.sale} scrollAnim={scrollAnim} />
      <Flex mx="2" mt={2}>
        <RegisterToBidButton sale={props.sale} />
      </Flex>
      <SaleArtworksRail saleArtworks={saleArtworks} />
    </Animated.ScrollView>
  )
}

export const SaleContainer = createFragmentContainer(Sale, {
  sale: graphql`
    fragment Sale_sale on Sale {
      ...SaleHeader_sale
      ...RegisterToBidButton_sale
      saleArtworksConnection(first: 10) {
        edges {
          node {
            ...SaleArtworksRail_saleArtworks
          }
        }
      }
    }
  `,
})

const Placeholder = () => <Spinner style={{ flex: 1 }} />

export const SaleQueryRenderer: React.FC<{ saleID: string }> = ({ saleID }) => {
  return (
    <QueryRenderer<SaleQueryRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SaleQueryRendererQuery($saleID: String!) {
          sale(id: $saleID) {
            ...Sale_sale
          }
        }
      `}
      variables={{ saleID }}
      render={renderWithPlaceholder({ Container: SaleContainer, renderPlaceholder: Placeholder })}
    />
  )
}
