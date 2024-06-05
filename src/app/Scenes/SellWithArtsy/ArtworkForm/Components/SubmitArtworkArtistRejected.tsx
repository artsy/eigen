import { OwnerType } from "@artsy/cohesion"
import { BulletedItem, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { SubmitArtworkArtistRejectedQuery } from "__generated__/SubmitArtworkArtistRejectedQuery.graphql"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { InfoModal } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/InfoModal/InfoModal"
import { navigate } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useFormikContext } from "formik"
import { useState } from "react"
import { ScrollView } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

export const SubmitArtworkArtistRejected: React.FC<{}> = () => {
  const { values } = useFormikContext<ArtworkDetailsFormModel>()
  const [isEligibilityModalVisible, setIsEligibilityModalVisible] = useState(false)

  const meData = useLazyLoadQuery<SubmitArtworkArtistRejectedQuery>(
    SubmitArtworkArtistRejectedStepQuery,
    {}
  )
  const me = meData.me ?? null

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.artworkFormArtistRejected })}
    >
      <Flex flex={1} px={2}>
        <ScrollView>
          <Text variant="lg-display">
            This artist isn't currently eligible to sell on our platform
          </Text>

          <Spacer y={2} />

          {!!values.artistSearchResult && <ArtistSearchResult result={values.artistSearchResult} />}

          <Spacer y={2} />

          <Text variant="sm">
            Try again with another artist or add your artwork to My Collection, your personal space
            to manage your collection, track demand for your artwork and see updates about the
            artist.
            {"\n"}
            {"\n"}If you'd like to know more, you can{" "}
            <Text
              underline
              onPress={() => {
                navigate("/sell/inquiry", {
                  passProps: {
                    email: me?.email ?? "",
                    name: me?.name ?? "",
                    phone: me?.phone ?? "",
                    userId: me?.internalID ?? undefined,
                  },
                })
              }}
            >
              contact an advisor
            </Text>{" "}
            or read about{" "}
            <Text
              underline
              onPress={() => {
                setIsEligibilityModalVisible(true)
              }}
            >
              what our advisors are looking for
            </Text>
            . {"\n"}
            {"\n"}After adding to My Collection, an Artsy Advisor will be in touch if there is an
            opportunity to sell your work in the future.
          </Text>
        </ScrollView>
        <InfoModal
          visible={isEligibilityModalVisible}
          title="Eligible artist criteria"
          onDismiss={() => setIsEligibilityModalVisible(false)}
          buttonVariant="outline"
        >
          <ScrollView>
            <Text>
              We are currently accepting unique and limited-edition works of art by modern,
              contemporary, and emerging artists who have collector demand on Artsy.
              {"\n"}
              {"\n"} Our experts assess a number of factors to determine whether your work qualifies
              for our program, including the following:{"\n"}
            </Text>
            <BulletedItem color="black100">
              Market data like the number, recency, and value of auction results for works by the
              artist.
            </BulletedItem>
            <BulletedItem color="black100">Authenticity and provenance information.</BulletedItem>
            <BulletedItem color="black100">
              Artwork details you provide, including images (front, back, signature), unframed
              dimensions, and additional documentation.
            </BulletedItem>
            <BulletedItem color="black100">The price you’re looking for.</BulletedItem>
          </ScrollView>
        </InfoModal>
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const SubmitArtworkArtistRejectedStepQuery = graphql`
  query SubmitArtworkArtistRejectedQuery {
    me {
      internalID
      email
      name
      phone
    }
  }
`
