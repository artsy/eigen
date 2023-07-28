import {
  Spacer,
  Box,
  Text,
  Join,
  Button,
  Screen,
  Touchable,
  CloseIcon,
  useSpace,
} from "@artsy/palette-mobile"
import { goBack, navigate } from "app/system/navigation/navigate"
import { useAndroidGoBack } from "app/utils/hooks/useBackHandler"
import { ScrollView } from "react-native"

export const CertificateOfAuthenticity: React.FC = () => {
  useAndroidGoBack()
  const space = useSpace()

  return (
    <Screen>
      <Screen.Header
        leftElements={
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={() => goBack()}
            hitSlop={{ top: space(2), left: space(2), bottom: space(2), right: space(2) }}
          >
            <CloseIcon fill="black100" />
          </Touchable>
        }
      />
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
                <Text
                  underline
                  onPress={() =>
                    navigate(
                      "https://support.artsy.net/s/article/What-Counts-as-an-Artworks-Proof-of-Authenticity"
                    )
                  }
                >
                  Help Center
                </Text>
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
