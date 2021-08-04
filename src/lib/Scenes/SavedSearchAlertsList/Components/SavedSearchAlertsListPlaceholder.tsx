import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { PlaceholderText } from "lib/utils/placeholders"
import { times } from "lodash"
import { Box, Flex } from "palette"
import React from "react"

export const SavedSearchAlertsListPlaceholder: React.FC = () => {
  return (
    <PageWithSimpleHeader title="Saved Alerts">
      <Box py={1}>
        {times(20).map((index: number) => (
          <Flex key={index} m={1.5}>
            <PlaceholderText height={23} />
          </Flex>
        ))}
      </Box>
    </PageWithSimpleHeader>
  )
}
