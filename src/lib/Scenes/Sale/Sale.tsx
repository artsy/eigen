import { Sale_me } from "__generated__/Sale_me.graphql"
import { Sale_sale } from "__generated__/Sale_sale.graphql"
import { SaleQueryRendererQuery } from "__generated__/SaleQueryRendererQuery.graphql"
import Spinner from "lib/Components/Spinner"
import { SwitchMenu } from "lib/Components/SwitchMenu"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Flex } from "palette"
import React, { useRef, useState } from "react"
import { Animated } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { RegisterToBidButton } from "./Components/RegisterToBidButton"
import { SaleArtworksRailContainer as SaleArtworksRail } from "./Components/SaleArtworksRail"
import { SaleHeaderContainer as SaleHeader } from "./Components/SaleHeader"
import { SaleLotsListContainer as SaleLotsList } from "./Components/SaleLotsList"

interface Props {
  sale: Sale_sale
  me: Sale_me
}

const saleSectionsData: SaleSection[] = [
  { key: "header" },
  { key: "registerToBid" },
  { key: "saleArtworksRail" },
  { key: "temporarySwitch" },
  { key: "saleLotsList" },
]

interface SaleSection {
  key: string
}

const Sale: React.FC<Props> = (props) => {
  const [showGrid, setShowGrid] = useState(true)

  const saleArtworks = extractNodes(props.sale.saleArtworksConnection)
  const scrollAnim = useRef(new Animated.Value(0)).current

  const switchView = (value: boolean) => {
    setShowGrid(value)
  }

  //  TODO: Remove this once the filters are implemented
  const renderTemporarySwitch = () => (
    <Flex px={2}>
      <SwitchMenu
        title={showGrid ? "Show Grid" : "Show List"}
        description="Show list of sale artworks"
        value={showGrid}
        onChange={(value) => switchView(value)}
      />
    </Flex>
  )
  return (
    <Animated.FlatList
      data={saleSectionsData}
      initialNumToRender={2}
      renderItem={({ item }: { item: SaleSection }) => {
        switch (item.key) {
          case "header":
            return <SaleHeader sale={props.sale} scrollAnim={scrollAnim} />
          case "registerToBid":
            return (
              <Flex mx="2" mt={2}>
                <RegisterToBidButton sale={props.sale} />
              </Flex>
            )
          case "saleArtworksRail":
            return <SaleArtworksRail saleArtworks={saleArtworks} />
          case "temporarySwitch":
            return renderTemporarySwitch()
          case "saleLotsList":
            return <SaleLotsList me={props.me} showGrid={showGrid} />
          default:
            return null
        }
      }}
      keyExtractor={(item: SaleSection) => item.key}
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
    />
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
  me: graphql`
    fragment Sale_me on Me {
      ...SaleLotsList_me
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
          me {
            ...Sale_me
          }
        }
      `}
      variables={{ saleID }}
      render={renderWithPlaceholder({ Container: SaleContainer, renderPlaceholder: Placeholder })}
    />
  )
}
