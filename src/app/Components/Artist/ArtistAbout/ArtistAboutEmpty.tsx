import { Box, BoxProps, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { FC } from "react"

export const ArtistAboutEmpty: FC<BoxProps> = (props) => {
  return (
    <Box {...props}>
      <Text variant="md" textAlign="center">
        We'll update this page when more information is available.
      </Text>

      <Text variant="md" textAlign="center" color="mono60">
        Do you represent this artist?
      </Text>
      <RouterLink to="https://partners.artsy.net" style={{ alignSelf: "center" }}>
        <Text variant="md" color="mono100" style={{ textDecorationLine: "underline" }}>
          Become a partner.
        </Text>
      </RouterLink>
    </Box>
  )
}
