import { Flex, Input, Text } from "@artsy/palette-mobile"
import { LocationAndContactQuery } from "__generated__/LocationAndContactQuery.graphql"
import { SellFormLayout } from "app/Scenes/Sell/Components/SellFormLayout"
import {
  EMPTY_SELL_LOCATION,
  SellLocation,
  SellLocationFields,
  isSellLocationComplete,
} from "app/Scenes/Sell/Components/SellLocationFields"
import {
  EMPTY_SELL_SHIPPING,
  SellShippingAnswers,
  SellShippingQuestions,
  areSellShippingAnswersComplete,
} from "app/Scenes/Sell/Components/SellShippingQuestions"
import { SellStepIntro } from "app/Scenes/Sell/Components/SellStepIntro"
import { SellSubmittedBottomSheet } from "app/Scenes/Sell/Components/SellSubmittedBottomSheet"
import { SellWorkCard } from "app/Scenes/Sell/Components/SellWorkCard"
import { SellFlowStore } from "app/Scenes/Sell/State/SellFlowStore"
import { getSellChannel } from "app/Scenes/Sell/utils/getSellChannel"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

type Artwork = NonNullable<LocationAndContactQuery["response"]["artwork"]>

export const LocationAndContact: React.FC = () => {
  const artworkID = SellFlowStore.useStoreState((state) => state.activeArtworkID)

  if (!artworkID) {
    return null
  }

  return <LocationAndContactContent artworkID={artworkID} />
}

const LocationAndContactContent: React.FC<{ artworkID: string }> = withSuspense({
  Component: ({ artworkID }) => {
    const data = useLazyLoadQuery<LocationAndContactQuery>(locationAndContactQuery, {
      artworkID,
    })
    const [submitted, setSubmitted] = useState(false)
    const artwork = data.artwork

    if (!artwork) {
      return <LocationAndContactError />
    }

    const isAuction = getSellChannel(artwork.internalID).kind === "AUCTION"

    return (
      <>
        {isAuction ? (
          <AuctionLocationForm artwork={artwork} onSubmit={() => setSubmitted(true)} />
        ) : (
          <MarketplaceShippingForm artwork={artwork} onSubmit={() => setSubmitted(true)} />
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
      ? `${artistNames}'s ${title} has been submitted for sale.`
      : "Your work has been submitted for sale.",
})

interface FormProps {
  artwork: Artwork
  onSubmit: () => void
}

const AuctionLocationForm: React.FC<FormProps> = ({ artwork, onSubmit }) => {
  const [location, setLocation] = useState<SellLocation>(EMPTY_SELL_LOCATION)
  const [phoneNumber, setPhoneNumber] = useState("")

  return (
    <SellFormLayout
      buttonLabel="Submit for Review"
      buttonDisabled={!isSellLocationComplete(location) || !phoneNumber.trim()}
      onButtonPress={onSubmit}
    >
      <SellStepIntro stepName="LocationAndContact" channelKind="AUCTION" px={2} />

      <Flex px={2} gap={4}>
        <SellWorkCard artwork={artwork} />

        <Flex gap={2}>
          <Text variant="md">Location</Text>
          <SellLocationFields value={location} onChange={setLocation} />
        </Flex>

        <Flex gap={1}>
          <Text variant="md">Contact</Text>
          <Text variant="sm">What's the best mobile number to reach you on?</Text>
          <Text variant="xs" color="mono60">
            A specialist will contact you directly to discuss next steps.
          </Text>
          <Input
            title="Mobile number"
            accessibilityLabel="Mobile number"
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </Flex>
      </Flex>
    </SellFormLayout>
  )
}

const MarketplaceShippingForm: React.FC<FormProps> = ({ artwork, onSubmit }) => {
  const [location, setLocation] = useState<SellLocation>(EMPTY_SELL_LOCATION)
  const [shipping, setShipping] = useState<SellShippingAnswers>(EMPTY_SELL_SHIPPING)
  const locationComplete = isSellLocationComplete(location)

  return (
    <SellFormLayout
      buttonLabel="List Artwork"
      buttonDisabled={!locationComplete || !areSellShippingAnswersComplete(shipping)}
      onButtonPress={onSubmit}
    >
      <SellStepIntro stepName="LocationAndContact" channelKind="MARKETPLACE" px={2} />

      <Flex px={2} pb={4} gap={4}>
        <SellWorkCard artwork={artwork} />

        <Flex gap={2}>
          <Text variant="md">Shipping</Text>
          <SellLocationFields value={location} onChange={setLocation} />
        </Flex>
      </Flex>

      <SellShippingQuestions value={shipping} onChange={setShipping} disabled={!locationComplete} />
    </SellFormLayout>
  )
}

const LocationAndContactError: React.FC = () => (
  <Flex px={2} pt={2}>
    <Text variant="sm" color="mono60">
      We couldn't load this work.
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
  }
`
