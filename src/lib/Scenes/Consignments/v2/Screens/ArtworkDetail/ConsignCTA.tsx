import { AppStore } from "lib/store/AppStore"
import { BorderBox, Box, Button, Flex, Sans } from "palette"
import React from "react"

export const ConsignCTA: React.FC = () => {
  const navActions = AppStore.actions.myCollection.navigation
  return (
    <BorderBox>
      <Flex flexDirection="row" justifyContent="space-between">
        <Box>
          <Sans size="4" weight="medium">
            Strong demand
          </Sans>
          <Sans size="4" color="black60">
            Est: $2,500 - $435,000
          </Sans>
        </Box>
        <Box>
          <Button size="large" onPress={() => navActions.navigateToConsign()}>
            Consign
          </Button>
        </Box>
      </Flex>
    </BorderBox>
  )
}
