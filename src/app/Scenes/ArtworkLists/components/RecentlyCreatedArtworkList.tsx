import { Box, Text } from "@artsy/palette-mobile"
import { FC } from "react"

export type RecentlyCreatedArtworkListEntity = {
  name: string
}

type RecentlyCreatedArtworkListProps = {
  artworkList: RecentlyCreatedArtworkListEntity
}

export const RecentlyCreatedArtworkList: FC<RecentlyCreatedArtworkListProps> = ({
  artworkList,
}) => {
  return (
    <Box bg="green100" p={2}>
      <Text color="white100">List Created</Text>
      <Text color="white100">{artworkList.name}</Text>
    </Box>
  )
}
