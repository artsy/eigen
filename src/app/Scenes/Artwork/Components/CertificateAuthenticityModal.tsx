import { NavigationContainer } from "@react-navigation/native"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { navigate } from "app/navigation/navigate"
import { Box, Join, Spacer, Text } from "palette"
import React from "react"

interface CertificateAuthenticityModalProps {
  visible: boolean
  onClose: () => void
}

export const CertificateAuthenticityModal: React.FC<CertificateAuthenticityModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <NavigationContainer independent>
      <FancyModal visible={visible} onBackgroundPressed={onClose}>
        <FancyModalHeader rightCloseButton onRightButtonPress={onClose}>
          <Text variant="lg">Certificate of Authenticity</Text>
        </FancyModalHeader>
        <Box flex={1} px={2} py={2}>
          <Join separator={<Spacer my={0.5} />}>
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
          </Join>
        </Box>
      </FancyModal>
    </NavigationContainer>
  )
}
