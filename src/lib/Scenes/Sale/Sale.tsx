import { Sale_sale$key } from "__generated__/Sale_sale.graphql"
import Spinner from "lib/Components/Spinner"
import { Flex, Sans } from "palette"

import { SaleQueryRendererQuery } from "__generated__/SaleQueryRendererQuery.graphql"
import React from "react"
import { graphql } from "react-relay"
import { useFragment, useQuery } from "relay-hooks"

interface Props {
  sale: Sale_sale$key
}

export const Sale: React.FC<Props> = props => {
  const sale = useFragment(SaleFragmentSpec, props.sale)
  return (
    <Flex mx="3" my="3">
      <Sans size="4t">Sale name: {sale.name}</Sans>
    </Flex>
  )
}

const SaleFragmentSpec = graphql`
  fragment Sale_sale on Sale {
    name
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
