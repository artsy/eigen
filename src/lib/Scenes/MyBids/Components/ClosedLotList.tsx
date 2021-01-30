import { ClosedLot_lotStanding } from "__generated__/ClosedLot_lotStanding.graphql"
import { Flex, Join, Separator, Text } from "palette"
import React from "react"
import { ClosedLot } from "./ClosedLot"

export const ClosedLotList: React.FC<{ closedStandings: ClosedLot_lotStanding[] }> = ({ closedStandings }) => {
  return (
    <>
      <Flex bg="white100">
        <Text variant="subtitle" mx={1.5} my={2}>
          Closed Bids
        </Text>
        <Separator />
      </Flex>
      <Flex data-test-id="closed-section">
        <Flex mt={2} px={1.5}>
          <Join separator={<Separator my={2} />}>
            {closedStandings?.map((ls) => {
              return (
                !!ls && (
                  <ClosedLot withTimelyInfo data-test-id="closed-sale-lot" lotStanding={ls} key={ls?.lot?.internalID} />
                )
              )
            })}
          </Join>
        </Flex>
      </Flex>
    </>
  )
}
