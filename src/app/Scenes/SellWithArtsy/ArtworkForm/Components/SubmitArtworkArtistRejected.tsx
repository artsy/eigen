import { CheckCircleFillIcon, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { InfoModal } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/InfoModal/InfoModal"
import { useFormikContext } from "formik"
import { useState } from "react"
import { ScrollView } from "react-native"

export const SubmitArtworkArtistRejected: React.FC<{}> = () => {
  const { values } = useFormikContext<ArtworkDetailsFormModel>()
  const [isEligibilityModalVisible, setIsEligibilityModalVisible] = useState(false)
  return (
    <Flex>
      {!!values.artistSearchResult && (
        <ArtistSearchResult
          result={values.artistSearchResult}
          icon={<CheckCircleFillIcon fill="green100" ml={0.5} height={18} width={18} />}
        />
      )}

      <Spacer y={2} />

      <Text variant="lg">This artist isn't currently eligible to sell on our platform</Text>

      <Spacer y={2} />

      <Text variant="sm">
        Try again with another artist or add your artwork to My Collection, your personal space to
        manage your collection, track demand for your artwork and see updates about the artist.
        {"\n"}
        {"\n"}If you'd like to know more, you can
        <Text
          underline
          onPress={() => {
            setIsEligibilityModalVisible(true)
          }}
        >
          read about what our specialists are looking for
        </Text>
        . {"\n"}
        {"\n"}After adding to My Collection, an Artsy Advisor will be in touch if there is an
        opportunity to sell your work in the future.
      </Text>
      <InfoModal
        visible={isEligibilityModalVisible}
        title="Eligible artist criteria"
        onDismiss={() => setIsEligibilityModalVisible(false)}
        buttonVariant="outline"
      >
        <ScrollView>
          <Text>
            {"  "}We are currently accepting unique and limited-edition works of art by modern,
            contemporary, and emerging artists who have collector demand on Artsy. Our in-house
            experts cover Post-War and Contemporary Art, Prints and Multiples, Street Art and
            Photographs.{"\n"}
            {"\n"}
            {"  "}Our experts assess a number of factors to determine whether your work qualifies
            for our program, including the following:{"\n"}
            {"\n"}
            {"    "}• Market data like the number, recency, and value of auction results for works
            by the artist.{"\n"}
            {"    "}• Authenticity and provenance information.{"\n"}
            {"    "}• Artwork details you provide, including images (front, back, signature),
            unframed dimensions, and additional documentation.{"\n"}
            {"    "}• The price you’re looking for.
          </Text>
        </ScrollView>
      </InfoModal>
    </Flex>
  )
}
