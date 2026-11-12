import { Flex, Text } from "@artsy/palette-mobile"
import { LocationAndContactQuery } from "__generated__/LocationAndContactQuery.graphql"
import { SellContactFields } from "app/Scenes/Sell/Components/SellContactFields"
import { SellFormLayout } from "app/Scenes/Sell/Components/SellFormLayout"
import { SellLocationFields } from "app/Scenes/Sell/Components/SellLocationFields"
import { SellShippingQuestions } from "app/Scenes/Sell/Components/SellShippingQuestions"
import { SellStepIntro } from "app/Scenes/Sell/Components/SellStepIntro"
import { SellSubmittedBottomSheet } from "app/Scenes/Sell/Components/SellSubmittedBottomSheet"
import { SellWorkCard } from "app/Scenes/Sell/Components/SellWorkCard"
import { SellFlowStore } from "app/Scenes/Sell/State/SellFlowStore"
import { SellLocationStore } from "app/Scenes/Sell/State/SellLocationStore"
import { getSellChannel } from "app/Scenes/Sell/utils/getSellChannel"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

type Artwork = NonNullable<LocationAndContactQuery["response"]["artwork"]>
type Me = NonNullable<LocationAndContactQuery["response"]["me"]>

export const LocationAndContact: React.FC = () => {
  const artworkID = SellFlowStore.useStoreState((state) => state.activeArtworkID)

  if (!artworkID) {
    return null
  }

  return (
    <SellLocationStore.Provider>
      <LocationAndContactContent artworkID={artworkID} />
    </SellLocationStore.Provider>
  )
}

const LocationAndContactContent: React.FC<{ artworkID: string }> = withSuspense({
  Component: ({ artworkID }) => {
    const data = useLazyLoadQuery<LocationAndContactQuery>(locationAndContactQuery, {
      artworkID,
    })
    const [submitted, setSubmitted] = useState(false)
    const { artwork, me } = data

    if (!artwork || !me) {
      return <LocationAndContactError />
    }

    const isAuction = getSellChannel(artwork.internalID).kind === "AUCTION"

    return (
      <>
        {isAuction ? (
          <AuctionLocationForm artwork={artwork} me={me} onSubmit={() => setSubmitted(true)} />
        ) : (
          <MarketplaceShippingForm artwork={artwork} me={me} onSubmit={() => setSubmitted(true)} />
        )}

        {!!submitted && (
          <SellSubmittedBottomSheet
            visible
            {...(isAuction ? auctionConfirmation() : marketplaceConfirmation(artwork))}
            onDismiss={() => setSubmitted(false)}
          />
        )}
      </>
    )
  },
  LoadingFallback: SpinnerFallback,
  ErrorFallback: () => <LocationAndContactError />,
})

const auctionConfirmation = () => ({
  title: "Submitted!",
  message: "One of our specialists will reach out to you directly to discuss next steps.",
})

const marketplaceConfirmation = ({ artistNames, title }: Artwork) => ({
  title: "Your listing is live!",
  message:
    artistNames && title
      ? `${artistNames}’s ${title} has been submitted for sale.`
      : "Your work has been submitted for sale.",
})

interface FormProps {
  artwork: Artwork
  me: Me
  onSubmit: () => void
}

const AuctionLocationForm: React.FC<FormProps> = ({ artwork, me, onSubmit }) => {
  const { locationComplete, phoneNumber } = SellLocationStore.useStoreState((state) => state)

  return (
    <SellFormLayout
      buttonLabel="Submit for Review"
      buttonDisabled={!locationComplete || !phoneNumber.trim()}
      onButtonPress={onSubmit}
    >
      <SellStepIntro stepName="LocationAndContact" channelKind="AUCTION" px={2} />

      <Flex px={2} gap={4}>
        <SellWorkCard artwork={artwork} />

        <Flex gap={2}>
          <Text variant="md">Location</Text>
          <SellLocationFields me={me} />
        </Flex>

        <SellContactFields />
      </Flex>
    </SellFormLayout>
  )
}

const MarketplaceShippingForm: React.FC<FormProps> = ({ artwork, me, onSubmit }) => {
  const { locationComplete, shippingComplete, phoneNumber } = SellLocationStore.useStoreState(
    (state) => state
  )

  return (
    <SellFormLayout
      buttonLabel="List Artwork"
      buttonDisabled={!locationComplete || !shippingComplete || !phoneNumber.trim()}
      onButtonPress={onSubmit}
    >
      <SellStepIntro stepName="LocationAndContact" channelKind="MARKETPLACE" px={2} />

      <Flex px={2} pb={4} gap={4}>
        <SellWorkCard artwork={artwork} />

        <Flex gap={2}>
          <Text variant="md">Shipping</Text>
          <SellLocationFields me={me} />
        </Flex>
      </Flex>

      <SellShippingQuestions />

      <Flex px={2} pt={4}>
        <SellContactFields />
      </Flex>
    </SellFormLayout>
  )
}

const LocationAndContactError: React.FC = () => (
  <Flex px={2} pt={2}>
    <Text variant="sm" color="mono60">
      We couldn’t load this work.
    </Text>
  </Flex>
)

const locationAndContactQuery = graphql`
  query LocationAndContactQuery($artworkID: String!) {
    artwork(id: $artworkID) {
      internalID
      artistNames
      title
      ...SellWorkCard_artwork
    }
    me {
      ...SellLocationFields_me
    }
  }
`
