import { SaleInfo_sale } from "__generated__/SaleInfo_sale.graphql"
import { SaleInfoQueryRendererQuery } from "__generated__/SaleInfoQueryRendererQuery.graphql"
import Spinner from "lib/Components/Spinner"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { saleTime } from "lib/utils/saleTime"
import moment from "moment"
import { Flex, Sans, Text } from "palette"
import React, { useMemo } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { RegisterToBidButton } from "../Sale/Components/RegisterToBidButton"

interface Props {
  sale: SaleInfo_sale
}

const SaleInfo: React.FC<Props> = ({ sale }) => {
  const isLiveBiddingAvailable = useMemo(() => {
    if (!sale.liveStartAt) {
      return false
    }
    return moment(sale.liveStartAt).isAfter(moment())
  }, [sale.liveStartAt])

  const saleTimeDetails = saleTime(sale)

  const renderLiveBiddingOpening = () => {
    if (!isLiveBiddingAvailable) {
      return null
    }
    return (
      <Flex>
        <Text variant="text" color="black" fontSize="size4" mt={25} fontWeight="500">
          {saleTimeDetails?.absolute.headline}
        </Text>
        <Text variant="text" color="black" fontSize="size4">
          {saleTimeDetails?.absolute.date}
        </Text>
      </Flex>
    )
  }

  return (
    <ScrollView>
      <Flex px={2} mt={70}>
        <Sans size="8">About this auction</Sans>
        <Sans size="5" mt={1} mb={3}>
          {sale.name}
        </Sans>
        <RegisterToBidButton sale={sale} />
        <Text variant="text" color="black" fontSize="size4" mt={25}>
          {sale.description}
        </Text>
        {renderLiveBiddingOpening()}
      </Flex>
    </ScrollView>
  )
}

export const SaleInfoContainer = createFragmentContainer(SaleInfo, {
  sale: graphql`
    fragment SaleInfo_sale on Sale {
      description
      endAt
      liveStartAt
      name
      startAt
      timeZone
      ...RegisterToBidButton_sale
    }
  `,
})

const Placeholder = () => <Spinner style={{ flex: 1 }} />

export const SaleInfoQueryRenderer: React.FC<{ sale_id: string }> = ({ sale_id: saleID }) => {
  return (
    <QueryRenderer<SaleInfoQueryRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SaleInfoQueryRendererQuery($saleID: String!) {
          sale(id: $saleID) {
            ...SaleInfo_sale
          }
        }
      `}
      variables={{ saleID }}
      render={renderWithPlaceholder({ Container: SaleInfoContainer, renderPlaceholder: Placeholder })}
    />
  )
}
