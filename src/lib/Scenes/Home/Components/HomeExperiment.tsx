import { useTreatment } from "lib/utils/useExperiments"
import { Flex, Text } from "palette"
import React from "react"

export const HomeExperiment = () => {
  const treatment = useTreatment("HomeScreenWorksForYouVsWorksByArtistsYouFollow")
  return (
    <Flex padding={2}>
      <Text variant="md">Active Treatment {treatment}:</Text>
    </Flex>
  )
}
