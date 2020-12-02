import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { SaleInfo } from "lib/Scenes/MyBids/Components/SaleInfo"
import { Flex, Separator, Text, Touchable } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { SaleCard_sale } from "__generated__/SaleCard_sale.graphql"

export const CARD_HEIGHT = 72

export class SaleCard extends React.Component<{ sale: SaleCard_sale; smallScreen?: boolean }> {
  render() {
    const { sale, children, smallScreen } = this.props

    return (
      <React.Fragment>
        <Touchable underlayColor="transparent" activeOpacity={0.8} onPress={() => navigate(sale?.href as string)}>
          <Flex overflow="hidden" borderWidth={1} borderStyle="solid" borderColor="black10" borderRadius={4}>
            <OpaqueImageView height={CARD_HEIGHT} imageURL={sale?.coverImage?.url} />
            <Flex style={{ margin: smallScreen! ? 10 : 15 }}>
              {!!sale.partner?.name && (
                <Text variant="small" color="black60">
                  {sale?.partner?.name}
                </Text>
              )}
              <Text variant="title">{sale?.name}</Text>

              <SaleInfo sale={sale} />
            </Flex>
            <Separator mt={1} />
            <Flex style={{ marginHorizontal: smallScreen! ? 10 : 20, marginVertical: 10 }}>{children}</Flex>
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
      coverImage {
        url
      }
      partner {
        name
      }
    }
  `,
})
