import { Flex } from "palette"
import React from "react"

export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const progressPercentage = Math.max(progress * 100, 2)

  return (
    <Flex width="100%" backgroundColor="black30" my={1}>
      <Flex
        testID="progress-bar"
        width={progressPercentage + "%"}
        height={2}
        backgroundColor="blue100"
      />
    </Flex>
  )
}
