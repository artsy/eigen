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
import { useSaveResaleSubmission } from "app/Scenes/Sell/hooks/useUpdateResaleSubmission"
import {
  ResaleSubmissionWithChannel,
  isResaleSubmissionSellable,
  toResaleSubmission,
} from "app/Scenes/Sell/utils/resaleSubmission"
import { toShippingAnswers } from "app/Scenes/Sell/utils/shippingAnswers"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

type Artwork = NonNullable<
  NonNullable<
    NonNullable<LocationAndContactQuery["response"]["me"]>["resaleSubmission"]
  >["submittedArtwork"]
>
type Me = NonNullable<LocationAndContactQuery["response"]["me"]>

export const LocationAndContact: React.FC = () => {
  const resaleSubmissionID = SellFlowStore.useStoreState((state) => state.activeResaleSubmissionID)

  if (!resaleSubmissionID) {
    return null
  }

  return (
    <SellLocationStore.Provider>
      <LocationAndContactContent resaleSubmissionID={resaleSubmissionID} />
    </SellLocationStore.Provider>
  )
}

const LocationAndContactContent: React.FC<{ resaleSubmissionID: string }> = withSuspense({
  Component: ({ resaleSubmissionID }) => {
    const { me } = useLazyLoadQuery<LocationAndContactQuery>(locationAndContactQuery, {
      resaleSubmissionID,
    })
    const [submitted, setSubmitted] = useState(false)
    const { resaleSubmission: submission } = me ?? {}
    const resaleSubmission = submission && toResaleSubmission(submission)
    const artwork = submission?.submittedArtwork

    if (!me || !isResaleSubmissionSellable(resaleSubmission) || !artwork) {
      return <LocationAndContactError />
    }

    const isAuction = resaleSubmission.channel === "AUCTION"

    return (
      <>
        {isAuction ? (
          <AuctionLocationForm
            artwork={artwork}
            me={me}
            resaleSubmission={resaleSubmission}
            onSubmit={() => setSubmitted(true)}
          />
        ) : (
          <MarketplaceShippingForm
            artwork={artwork}
            me={me}
            resaleSubmission={resaleSubmission}
            onSubmit={() => setSubmitted(true)}
          />
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
  resaleSubmission: ResaleSubmissionWithChannel
  onSubmit: () => void
}

const AuctionLocationForm: React.FC<FormProps> = ({ artwork, me, resaleSubmission, onSubmit }) => {
  const { locationComplete, phoneNumber } = SellLocationStore.useStoreState((state) => state)

  return (
    <SellFormLayout
      buttonLabel="Submit for Review"
      buttonDisabled={!locationComplete || !phoneNumber.trim()}
      onButtonPress={onSubmit}
    >
      <SellStepIntro stepName="LocationAndContact" channelKind="AUCTION" px={2} />

      <Flex px={2} gap={4}>
        <SellWorkCard artwork={artwork} resaleSubmission={resaleSubmission} />

        <Flex gap={2}>
          <Text variant="md">Location</Text>
          <SellLocationFields me={me} />
        </Flex>

        <SellContactFields />
      </Flex>
    </SellFormLayout>
  )
}

const MarketplaceShippingForm: React.FC<FormProps> = ({
  artwork,
  me,
  resaleSubmission,
  onSubmit,
}) => {
  const { locationComplete, shippingComplete, phoneNumber, packaging, packer, delivery } =
    SellLocationStore.useStoreState((state) => state)
  const { save, saving } = useSaveResaleSubmission({ onSaved: onSubmit })

  // Listing the work, the address and the phone number wait on backend support
  const saveAndSubmit = () => {
    if (!packaging || !packer || !delivery) {
      return
    }

    save({ id: resaleSubmission.internalID, ...toShippingAnswers({ packaging, packer, delivery }) })
  }

  return (
    <SellFormLayout
      buttonLabel="List Artwork"
      buttonDisabled={!locationComplete || !shippingComplete || !phoneNumber.trim()}
      buttonLoading={saving}
      onButtonPress={saveAndSubmit}
    >
      <SellStepIntro stepName="LocationAndContact" channelKind="MARKETPLACE" px={2} />

      <Flex px={2} pb={4} gap={4}>
        <SellWorkCard artwork={artwork} resaleSubmission={resaleSubmission} />

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
  query LocationAndContactQuery($resaleSubmissionID: String!) {
    me {
      ...SellLocationFields_me
      resaleSubmission(id: $resaleSubmissionID) {
        ...resaleSubmission_resaleSubmission
        submittedArtwork {
          internalID
          artistNames
          title
          ...SellWorkCard_artwork
        }
      }
    }
  }
`
