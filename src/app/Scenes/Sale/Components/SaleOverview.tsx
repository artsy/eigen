import { Flex, Tabs } from "@artsy/palette-mobile"
import { NewBuyNowArtworksRail_sale$key } from "__generated__/NewBuyNowArtworksRail_sale.graphql"
import { SaleArtworksRail_me$key } from "__generated__/SaleArtworksRail_me.graphql"
import { NewBuyNowArtworksRail } from "app/Scenes/Sale/Components/NewBuyNowArtworksRail"
import { SaleArtworksRail } from "app/Scenes/Sale/Components/SaleArtworksRail"

interface SaleOverviewProps {
  me: SaleArtworksRail_me$key
  sale: NewBuyNowArtworksRail_sale$key
}

export const SaleOverview: React.FC<SaleOverviewProps> = ({ me, sale }) => {
  return (
    <Tabs.ScrollView contentContainerStyle={{ marginHorizontal: 0 }}>
      <Flex py={2}>
        <SaleArtworksRail me={me} />
        <NewBuyNowArtworksRail sale={sale} />
      </Flex>
    </Tabs.ScrollView>
  )
}
