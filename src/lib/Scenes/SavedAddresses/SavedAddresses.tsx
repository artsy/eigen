import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { Button, Flex, Text } from "palette"
import React from "react"

export const SavedAddresses: React.FC = () => {
  return (
    <PageWithSimpleHeader title="Saved Addresses">
      <Flex py={3} px={2} alignItems="center" height="100%" justifyContent="center">
        <Text variant="title" mb={2}>
          No Saved Addresses
        </Text>
        <Text variant="caption" textAlign="center" mb={3}>
          Please add an address for a faster checkout experience in the future.
        </Text>
        <Button block variant="primaryBlack" width={100}>
          Add New Address
        </Button>
      </Flex>
    </PageWithSimpleHeader>
  )
}
