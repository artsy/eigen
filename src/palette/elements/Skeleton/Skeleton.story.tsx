import { storiesOf } from "@storybook/react"
import React from "react"
import { Box } from "../Box"
import { SkeletonBox, SkeletonText } from "./Skeleton"

storiesOf("Components/Skeleton", module)
  .add("SkeletonBox", () => {
    return (
      <>
        <SkeletonBox m={2} width={400} height={300} />
        <SkeletonBox m={2} width={400} height={300} done />
        <SkeletonBox m={2} width={400} height={300} borderRadius="1em" />
      </>
    )
  })
  .add("SkeletonText", () => {
    return (
      <Box m={1}>
        <SkeletonText variant="text" borderRadius={4}>
          loading
        </SkeletonText>

        <SkeletonText variant="mediumText" borderRadius={4}>
          still waiting...
        </SkeletonText>

        <SkeletonText variant="title" borderRadius={4}>
          please wait
        </SkeletonText>

        <SkeletonText variant="largeTitle" borderRadius={4}>
          hold
        </SkeletonText>
      </Box>
    )
  })
  .add("Example placeholder", () => {
    return (
      <Box display="flex" alignItems="center" px={2} py={1}>
        <SkeletonBox width={40} height={40} mr={1} />

        <Box>
          <SkeletonText variant="small" borderRadius={2}>
            Pending Artwork Title
          </SkeletonText>

          <SkeletonText variant="small" borderRadius={2}>
            Pending Artist
          </SkeletonText>
        </Box>
      </Box>
    )
  })
