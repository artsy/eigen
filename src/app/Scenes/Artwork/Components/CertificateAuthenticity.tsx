import { Box, Button, Join, LinkText, Screen, Spacer, Text } from "@artsy/palette-mobile"
// eslint-disable-next-line no-restricted-imports
import { goBack, navigate } from "app/system/navigation/navigate"
import { ScrollView } from "react-native"

const HELP_CENTER_URL =
  "https://support.artsy.net/s/article/What-Counts-as-an-Artworks-Proof-of-Authenticity"

export const CertificateOfAuthenticity: React.FC = () => {
  return (
    <Screen>
      <Screen.Body fullwidth>
        <Screen.Header onBack={goBack} />
        <ScrollView>
          <Box px={2}>
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
                {/* A nested LinkText stays on the text baseline; a RouterLink (a View) inside Text didn't */}
                <LinkText accessibilityRole="link" onPress={() => navigate(HELP_CENTER_URL)}>
                  Help Center
                </LinkText>
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
