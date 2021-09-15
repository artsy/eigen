import { PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { Flex, Separator, Spacer, Theme } from "palette"
import React from "react"

export const MyCollectionAndSavedWorksGridPlaceHolder: React.FC<{}> = () => {
  return (
    <Theme>
      <Flex>
        <Flex flexDirection="row" justifyContent="space-between">
          <Spacer />
          <Spacer />
          <PlaceholderText width={70} margin={20} />
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px="2">
          <Flex>
            <Spacer mb={40} />
            {/* Entity name */}
            <PlaceholderText width={180} />
            {/* subtitle text */}
            <PlaceholderText width={100} />
          </Flex>
        </Flex>
        <Spacer mb={3} />
        {/* tabs */}
        <Flex justifyContent="space-around" flexDirection="row" px={2}>
          <PlaceholderText width={"40%"} />
          <PlaceholderText width={"40%"} />
        </Flex>
        <Spacer mb={1} />
        <Separator />
        <Spacer mb={3} />
        {/* masonry grid */}
        <PlaceholderGrid />
      </Flex>
    </Theme>
  )
}
