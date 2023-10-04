import { Box, BoxProps, Text, Touchable } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { FC } from "react"

export const ArtistAboutEmpty: FC<BoxProps> = (props) => {
  return (
    <Box {...props}>
      <Text variant="md" textAlign="center">
        We'll update this page when more information is available.
      </Text>

      <Text variant="md" textAlign="center" color="black60">
        Do you represent this artist?
      </Text>
      <Touchable
        onPress={() => {
          navigate("https://partners.artsy.net")
        }}
        style={{ alignSelf: "center" }}
      >
        <Text variant="md" color="black100" style={{ textDecorationLine: "underline" }}>
          Become a partner.
        </Text>
      </Touchable>
    </Box>
  )
}
