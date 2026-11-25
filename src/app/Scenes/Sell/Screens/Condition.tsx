import { Flex, Text } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { ConditionQuery } from "__generated__/ConditionQuery.graphql"
import { SellConditionSection } from "app/Scenes/Sell/Components/SellConditionSection"
import { SellFormLayout } from "app/Scenes/Sell/Components/SellFormLayout"
import { SellPriceSection } from "app/Scenes/Sell/Components/SellPriceSection"
import { SellStepIntro } from "app/Scenes/Sell/Components/SellStepIntro"
import { SellUploadProgress } from "app/Scenes/Sell/Components/SellUploadProgress"
import { SellWorkCard } from "app/Scenes/Sell/Components/SellWorkCard"
import { SellNavigationProp } from "app/Scenes/Sell/Sell"
import { SellConditionStore } from "app/Scenes/Sell/State/SellConditionStore"
import { SellFlowStore } from "app/Scenes/Sell/State/SellFlowStore"
import { sellConditionSchema } from "app/Scenes/Sell/State/sellConditionSchema"
import { useConfirmLeavingConditionStep } from "app/Scenes/Sell/hooks/useConfirmLeavingConditionStep"
import { useSaveResaleSubmission } from "app/Scenes/Sell/hooks/useUpdateResaleSubmission"
import { toSavedConditionPhotos } from "app/Scenes/Sell/utils/conditionPhotos"
import {
  ResaleSubmissionWithChannel,
  isResaleSubmissionSellable,
  toResaleSubmission,
} from "app/Scenes/Sell/utils/resaleSubmission"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

type Artwork = NonNullable<
  NonNullable<NonNullable<ConditionQuery["response"]["me"]>["resaleSubmission"]>["submittedArtwork"]
>

export const Condition: React.FC = () => {
  const resaleSubmissionID = SellFlowStore.useStoreState((state) => state.activeResaleSubmissionID)

  if (!resaleSubmissionID) {
    return null
  }

  return <ConditionContent resaleSubmissionID={resaleSubmissionID} />
}

const ConditionContent: React.FC<{ resaleSubmissionID: string }> = withSuspense({
  Component: ({ resaleSubmissionID }) => {
    const navigation = useNavigation<SellNavigationProp>()
    const { me } = useLazyLoadQuery<ConditionQuery>(conditionQuery, { resaleSubmissionID })
    const { resaleSubmission: submission } = me ?? {}
    const resaleSubmission = submission && toResaleSubmission(submission)
    const artwork = submission?.submittedArtwork

    if (!isResaleSubmissionSellable(resaleSubmission) || !artwork) {
      return <ConditionError />
    }

    const savedPhotos = toSavedConditionPhotos(submission)

    return (
      <SellConditionStore.Provider
        runtimeModel={{
          photos: savedPhotos,
          savedPhotoIDs: savedPhotos.flatMap((photo) => (photo.imageID ? [photo.imageID] : [])),
        }}
      >
        <ConditionForm
          artwork={artwork}
          resaleSubmission={resaleSubmission}
          onContinue={() => navigation.navigate("LocationAndContact")}
        />
      </SellConditionStore.Provider>
    )
  },
  LoadingFallback: SpinnerFallback,
  ErrorFallback: () => <ConditionError />,
})

const ConditionForm: React.FC<{
  artwork: Artwork
  resaleSubmission: ResaleSubmissionWithChannel
  onContinue: () => void
}> = ({ artwork, resaleSubmission, onContinue }) => {
  const answers = SellConditionStore.useStoreState((state) => state)
  useConfirmLeavingConditionStep()
  const { setSavedPhotos, restoreSavedPhotos } = SellConditionStore.useStoreActions(
    (actions) => actions
  )
  const { save, saving, uploadProgress } = useSaveResaleSubmission({
    onSaved: (savedPhotos) => {
      setSavedPhotos(savedPhotos)
      onContinue()
    },
    onPhotosReloaded: restoreSavedPhotos,
  })

  const channelKind = resaleSubmission.channel
  const isMarketplace = channelKind === "MARKETPLACE"
  const canContinue = sellConditionSchema(channelKind).isValidSync(answers)

  const saveAndContinue = () => {
    save(
      {
        id: resaleSubmission.internalID,
        condition: answers.rating,
        notes: answers.notes.trim(),
        ...(isMarketplace && { priceListed: answers.askingPrice }),
      },
      { photos: answers.photos, savedPhotoIDs: answers.savedPhotoIDs }
    )
  }

  return (
    <SellFormLayout
      buttonLabel={isMarketplace ? "Confirm Listing Price" : "Continue"}
      buttonDisabled={!canContinue}
      buttonLoading={saving}
      onButtonPress={saveAndContinue}
      footerContent={!!uploadProgress && <SellUploadProgress {...uploadProgress} />}
    >
      <SellStepIntro stepName="Condition" channelKind={channelKind} px={2} />

      <Flex px={2} pb={4}>
        <SellWorkCard artwork={artwork} resaleSubmission={resaleSubmission} />
      </Flex>

      <SellConditionSection />

      {!!isMarketplace && (
        <Flex px={2} pt={4}>
          <SellPriceSection
            artistNames={artwork.artistNames}
            recommendedPriceRange={resaleSubmission.recommendedPriceRange}
          />
        </Flex>
      )}
    </SellFormLayout>
  )
}

const ConditionError: React.FC = () => (
  <Flex px={2} pt={2}>
    <Text variant="sm" color="mono60">
      We couldn’t load this work.
    </Text>
  </Flex>
)

const conditionQuery = graphql`
  query ConditionQuery($resaleSubmissionID: String!) {
    me {
      resaleSubmission(id: $resaleSubmissionID) {
        ...resaleSubmission_resaleSubmission
        ...conditionPhotos_resaleSubmission
        submittedArtwork {
          internalID
          artistNames
          ...SellWorkCard_artwork
        }
      }
    }
  }
`
