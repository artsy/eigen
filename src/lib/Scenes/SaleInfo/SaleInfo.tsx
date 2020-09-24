import { SaleInfo_sale } from "__generated__/SaleInfo_sale.graphql"
import { SaleInfoQueryRendererQuery } from "__generated__/SaleInfoQueryRendererQuery.graphql"
import Spinner from "lib/Components/Spinner"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Sans } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Props {
  sale: SaleInfo_sale
}

const SaleInfo: React.FC<Props> = (props) => {
  return (
    <ScrollView>
      <Sans size="4">Working</Sans>
    </ScrollView>
  )
}

export const SaleInfoContainer = createFragmentContainer(SaleInfo, {
  sale: graphql`
    fragment SaleInfo_sale on Sale {
      name
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
