import { Spacer, Box } from "@artsy/palette-mobile"
import { goBack, navigate } from "app/system/navigation/navigate"
import { Button, Join, Text } from "palette"
import { ScrollView } from "react-native"
import { useScreenDimensions } from "shared/hooks"

export const CertificateOfAuthenticity: React.FC = () => {
  const { safeAreaInsets } = useScreenDimensions()

  return (
    <ScrollView>
      <Box flex={1} pt={`${safeAreaInsets.top}px`} pb={`${safeAreaInsets.bottom}px`} px={2} py={2}>
        <Join separator={<Spacer y={2} />}>
          <Text variant="lg-display">Certificate of Authenticity</Text>
          <Text>
            A certificate of authenticity (COA) is a document from an authoritative source that
            verifies the artwork’s authenticity. While many COAs are signed by the artist, others
            will be signed by the representing gallery or the printmaker who collaborated with the
            artist on the work. For secondary market works, authorized estates or foundations are
            often the issuing party.
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
                  "https://support.artsy.net/hc/en-us/articles/360058123933-What-Counts-as-an-Artwork-s-Proof-of-Authenticity-"
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
  )
}
