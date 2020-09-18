import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { SaleTime } from "lib/Scenes/MyBids/Components/SaleTime"
import { Flex, Separator, Text, Touchable } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { SaleCard_sale } from "__generated__/SaleCard_sale.graphql"

export const CARD_HEIGHT = 72

export class SaleCard extends React.Component<{ sale: SaleCard_sale }> {
  render() {
    const { sale, children } = this.props
    return (
      <React.Fragment>
        <Touchable
          underlayColor="transparent"
          activeOpacity={0.8}
          onPress={() => SwitchBoard.presentNavigationViewController(this, sale?.href as string)}
        >
          <Flex overflow="hidden" borderWidth={1} borderStyle="solid" borderColor="black10" borderRadius={4}>
            <OpaqueImageView height={CARD_HEIGHT} imageURL={sale?.coverImage?.url} />
            <Flex style={{ margin: 15 }}>
              {!!sale.partner?.name && (
                <Text variant="small" color="black60">
                  {sale.partner.name}
                </Text>
              )}
              <Text variant="title">{sale?.name}</Text>

              <SaleTime sale={sale} />
            </Flex>
            <Separator mt={1} />
            <Flex mx={2} my={1}>
              {children}
            </Flex>
          </Flex>
        </Touchable>
      </React.Fragment>
    )
  }
}

export const SaleCardFragmentContainer = createFragmentContainer(SaleCard, {
  sale: graphql`
    fragment SaleCard_sale on Sale {
      href
      name
      liveStartAt
      endAt
      displayTimelyAt
      coverImage {
        url
      }
      partner {
        name
      }
    }
  `,
})
