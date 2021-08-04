import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { PlaceholderText } from "lib/utils/placeholders"
import { useScreenDimensions } from 'lib/utils/useScreenDimensions'
import { times } from "lodash"
import { Box, Flex, Separator, useTheme } from "palette"
import React from "react"

export const SavedSearchAlertsListPlaceholder: React.FC = () => {
  const { width } = useScreenDimensions()
  const { space } = useTheme()

  return (
    <PageWithSimpleHeader title="Saved Alerts">
      {times(20).map((index: number) => (
        <Flex key={index}>
          <Flex m={2}>
            <PlaceholderText height={30} />
          </Flex>
          <Separator width={width - 2 * space(2)} mx={2} />
        </Flex>
      ))}
    </PageWithSimpleHeader>
  )
}
