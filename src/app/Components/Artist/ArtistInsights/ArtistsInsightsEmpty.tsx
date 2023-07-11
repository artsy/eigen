import { Box, BoxProps, Button, Spacer, Text } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { FC } from "react"

export const ArtistInsightsEmpty: FC<BoxProps> = (props) => {
  return (
    <Box {...props}>
      <Text variant="md" textAlign="center">
        There are currently no auction results for this artist.
      </Text>

      <Text variant="md" textAlign="center" color="black60">
        We'll update this page when results become available. Meanwhile, you can check out free
        auction results and art market data for over 300,000 artists.
      </Text>

      <Spacer y={2} />

      <Button
        variant="outline"
        mx="auto"
        onPress={() => {
          navigate("/price-database")
        }}
      >
        View Artsy’s Price Database
      </Button>
    </Box>
  )
}
