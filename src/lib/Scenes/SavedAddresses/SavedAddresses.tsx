import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { Flex, Sans } from "palette"
import React from "react"

export const SavedAddresses: React.FC = () => {
  return (
    <PageWithSimpleHeader title="Saved Addresses">
      <Flex py={3} px={2} alignItems="center">
        <Sans size="4t" color="black100" weight="regular">
          No Saved Addresses
        </Sans>
      </Flex>
    </PageWithSimpleHeader>
  )
}
