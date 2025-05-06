import { Box, Button, Join, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { goBack } from "app/system/navigation/navigate"
import { ScrollView } from "react-native"

export const CertificateOfAuthenticity: React.FC = () => {
  return (
    <Screen>
      <Screen.Body>
        <ScrollView>
          <Box py={2}>
            <Join separator={<Spacer y={2} />}>
              <Text variant="lg-display">Certificate of Authenticity</Text>
              <Text>
                A certificate of authenticity (COA) is a document from an authoritative source that
                verifies the artwork’s authenticity. While many COAs are signed by the artist,
                others will be signed by the representing gallery or the printmaker who collaborated
                with the artist on the work. For secondary market works, authorized estates or
                foundations are often the issuing party.
              </Text>
              <Text>
                COAs typically include the name of the artist, the details (title, date, medium,
                dimensions) of the work in question, and whenever possible an image of the work.
              </Text>
              <Text>
                Read more about artwork authenticity in our{" "}
                <RouterLink
                  to="https://support.artsy.net/s/article/What-Counts-as-an-Artworks-Proof-of-Authenticity"
                  hasChildTouchable
                >
                  <Text underline>Help Center</Text>
                </RouterLink>
                .
              </Text>
              <Button onPress={() => goBack()} block>
                OK
              </Button>
            </Join>
          </Box>
        </ScrollView>
      </Screen.Body>
    </Screen>
  )
}
