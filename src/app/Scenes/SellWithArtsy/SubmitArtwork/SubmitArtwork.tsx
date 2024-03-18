import { OwnerType, ContextModule } from "@artsy/cohesion"
import {
  CollapsibleMenuItem,
  Text,
  Separator,
  Join,
  Screen,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { ErrorView } from "app/Components/ErrorView/ErrorView"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import {
  artworkDetailsCompletedEvent,
  consignmentSubmittedEvent,
  contactInformationCompletedEvent,
  toggledAccordionEvent,
  uploadPhotosCompletedEvent,
} from "app/Scenes/SellWithArtsy/utils/TrackingEvent"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { isEqual } from "lodash"
import React, { useRef, useState } from "react"
import { ScrollView } from "react-native"
import { useTracking } from "react-tracking"
import { ArtworkDetails } from "./ArtworkDetails/ArtworkDetails"
import { createOrUpdateSubmission } from "./ArtworkDetails/utils/createOrUpdateSubmission"
import { ArtworkDetailsFormModel } from "./ArtworkDetails/validation"
import { ArtworkSubmittedScreen } from "./ArtworkSubmitted"
import { ContactInformationQueryRenderer } from "./ContactInformation/ContactInformation"
import { ContactInformationFormModel } from "./ContactInformation/validation"
import { UploadPhotos } from "./UploadPhotos/UploadPhotos"

export enum STEPS {
  ArtworkDetails = "ArtworkDetails",
  UploadPhotos = "UploadPhotos",
  ContactInformation = "ContactInformation",
}

const STEPS_IN_ORDER: STEPS[] = [STEPS.ContactInformation, STEPS.ArtworkDetails, STEPS.UploadPhotos]

type SubmitArtworkScreenNavigationProps = StackScreenProps<
  SubmitArtworkOverviewNavigationStack,
  "SubmitArtworkScreen"
>

export const SubmitArtworkScreen: React.FC<SubmitArtworkScreenNavigationProps> = ({
  navigation,
}) => {
  return <SubmitSWAArtworkFlow navigation={navigation} stepsInOrder={STEPS_IN_ORDER} />
}

interface SubmitSWAArtworkFlowProps {
  navigation: SubmitArtworkScreenNavigationProps["navigation"]
  stepsInOrder: STEPS[]
}

export const SubmitSWAArtworkFlow: React.FC<SubmitSWAArtworkFlowProps> = ({
  navigation,
  stepsInOrder,
}) => {
  const { trackEvent } = useTracking()
  const { showActionSheetWithOptions } = useActionSheet()
  const { safeAreaInsets } = useScreenDimensions()
  const {
    submissionId: submissionID,
    artworkDetails,
    dirtyArtworkDetailsValues,
  } = GlobalStore.useAppState((store) => store.artworkSubmission.submission)

  const { userID, userEmail } = GlobalStore.useAppState((state) => state.auth)

  // By default the userEmail is the user's email, but they can change that email in the form,
  // and when they do we want to continue the tracking with the new email
  const [desiredEmail, setDesiredEmail] = useState(userEmail)

  const [activeStep, setActiveStep] = useState(0)

  const [hasError, setHasError] = useState(false)

  const artworkDetailsFromValuesRef = useRef(artworkDetails)
  artworkDetailsFromValuesRef.current = artworkDetails

  const track = (id: string, email?: string | null) => {
    if (activeStep === stepsInOrder.length - 1) {
      trackEvent(consignmentSubmittedEvent(id, email, userID))
    }

    const step = stepsInOrder[activeStep]

    if (step === STEPS.ArtworkDetails) {
      trackEvent(artworkDetailsCompletedEvent(id, email, userID))
    } else if (step === STEPS.UploadPhotos) {
      trackEvent(uploadPhotosCompletedEvent(id, email, userID))
    } else if (step === STEPS.ContactInformation) {
      trackEvent(contactInformationCompletedEvent(id, email, userID))
    }
  }

  const handlePress = async (
    formValues: ArtworkDetailsFormModel | ContactInformationFormModel | {}
  ) => {
    const isLastStep = activeStep === stepsInOrder.length - 1
    const values = {
      ...artworkDetails,
      ...formValues,
      state: (isLastStep ? "SUBMITTED" : undefined) as ArtworkDetailsFormModel["state"],
    } as ArtworkDetailsFormModel & ContactInformationFormModel

    const email = values.userEmail ? values.userEmail : desiredEmail

    try {
      const id = await createOrUpdateSubmission(values, submissionID)

      if (id) {
        track(id, email)

        if (isLastStep) {
          refreshMyCollection()
          GlobalStore.actions.artworkSubmission.submission.resetSessionState()
          if (!values.myCollectionArtworkID) {
            // add clue only if it is not MyCollectionArtwork that was submitted
            GlobalStore.actions.visualClue.addClue("ArtworkSubmissionMessage")
          }
          return navigation.navigate("ArtworkSubmittedScreen", { submissionId: id })
        }

        GlobalStore.actions.artworkSubmission.submission.setSubmissionId(id)

        if (stepsInOrder[activeStep] === STEPS.ArtworkDetails) {
          GlobalStore.actions.artworkSubmission.submission.setArtworkDetailsForm(
            formValues as ArtworkDetailsFormModel
          )
        }
      }
    } catch (error) {
      // Error with mutation.

      captureMessage(`createOrUpdateSubmission ${JSON.stringify(error)}`)
      setHasError(true)
      return
    }

    if (email && email !== desiredEmail) {
      setDesiredEmail(email)
    }
    expandCollapsibleMenuContent(activeStep + 1)
    setActiveStep(activeStep + 1)
  }

  const items = stepsInOrder.map((step, index) => {
    const staticValues = { overtitle: `Step ${index + 1} of ${stepsInOrder.length}` }
    const isLastStep = index === stepsInOrder.length - 1
    switch (step) {
      case STEPS.ArtworkDetails:
        return {
          ...staticValues,
          title: "Artwork Details",
          contextModule: ContextModule.artworkDetails,
          Content: <ArtworkDetails handlePress={handlePress} isLastStep={isLastStep} />,
        }
      case STEPS.UploadPhotos:
        return {
          ...staticValues,
          title: "Upload Photos",
          contextModule: ContextModule.uploadPhotos,
          Content: <UploadPhotos handlePress={handlePress} isLastStep={isLastStep} />,
        }
      case STEPS.ContactInformation:
        return {
          ...staticValues,
          title: "Contact Information",
          contextModule: ContextModule.contactInformation,
          Content: (
            <ContactInformationQueryRenderer handlePress={handlePress} isLastStep={isLastStep} />
          ),
        }
    }
  })

  const stepsRefs = useRef<CollapsibleMenuItem[]>(new Array(items.length).fill(null)).current
  const scrollViewRef = useRef<ScrollView>(null)

  const expandCollapsibleMenuContent = (indexToExpand: number) => {
    const indexToCollapse = stepsRefs.findIndex((ref) => ref.isExpanded())

    const scrollToStep = () =>
      stepsRefs[indexToExpand].offsetTop().then((offset) => {
        scrollViewRef.current?.scrollTo({ y: offset - 20 || 0 })
      })

    if (indexToCollapse >= 0) {
      stepsRefs[indexToCollapse].collapse(() => {
        setTimeout(() => {
          if (indexToExpand > 0) {
            stepsRefs[indexToExpand - 1].completed()
          }

          stepsRefs[indexToExpand].expand(() => scrollToStep())
        }, 100)
      })
    } else {
      stepsRefs[indexToExpand].expand(() => scrollToStep())
    }
  }

  const handleBackPress = async () => {
    const isFormDirty = !isEqual(artworkDetailsFromValuesRef.current, dirtyArtworkDetailsValues)

    /*
    action sheet is displayed only on 1st screen (Artwork Details)
    since form data is saved on the server and a draft submission is created  after the first step
    */
    if (activeStep === 0 && isFormDirty) {
      const leaveSubmission = await new Promise((resolve) =>
        showActionSheetWithOptions(
          {
            title: "Do you want to discard your changes?",
            options: ["Discard", "Keep editing"],
            destructiveButtonIndex: 0,
            cancelButtonIndex: 1,
            useModal: true,
          },
          (buttonIndex) => {
            if (buttonIndex === 0) {
              resolve(true)
            }
          }
        )
      )

      if (!leaveSubmission) {
        return
      }
    }

    goBack()
  }

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.consignmentFlow,
      })}
    >
      <Screen.Header onBack={handleBackPress} />
      <Screen.Body pb={`${safeAreaInsets.bottom}px`}>
        <Screen.ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Join separator={<Separator mt={4} mb={2} />}>
            {items.map(({ overtitle, title, Content, contextModule }, index) => (
              <CollapsibleMenuItem
                key={index}
                overtitle={overtitle}
                title={title}
                onExpand={() => {
                  trackEvent(toggledAccordionEvent(submissionID, contextModule, title, true))
                  expandCollapsibleMenuContent(index)
                }}
                onCollapse={() => {
                  trackEvent(toggledAccordionEvent(submissionID, contextModule, title, false))
                }}
                isExpanded={index === 0}
                disabled={activeStep !== index}
                ref={(ref) => {
                  if (ref) {
                    stepsRefs[index] = ref
                  }
                }}
              >
                {Content}
              </CollapsibleMenuItem>
            ))}
          </Join>
        </Screen.ScrollView>
      </Screen.Body>
      <FancyModal visible={hasError} onBackgroundPressed={() => setHasError(false)}>
        <FancyModalHeader onRightButtonPress={() => setHasError(false)} rightCloseButton>
          <Text variant="md">Error</Text>
        </FancyModalHeader>
        <ErrorView
          message={`We encountered an error while ${
            activeStep !== stepsInOrder.length - 1 ? "saving" : "submitting"
          } the Artwork. Please try again shortly`}
        />
      </FancyModal>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export type SubmitArtworkOverviewNavigationStack = {
  SubmitArtworkScreen: undefined
  ArtworkSubmittedScreen: { submissionId: string }
}

const StackNavigator = createStackNavigator<SubmitArtworkOverviewNavigationStack>()

export const SubmitArtwork = () => {
  return (
    <NavigationContainer independent>
      <StackNavigator.Navigator
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
          headerMode: "screen",
          cardStyle: { backgroundColor: "white" },
        }}
      >
        <StackNavigator.Screen name="SubmitArtworkScreen" component={SubmitArtworkScreen} />
        <StackNavigator.Screen
          name="ArtworkSubmittedScreen"
          component={ArtworkSubmittedScreen}
          options={{ gestureEnabled: false, headerLeft: () => <></> }}
        />
      </StackNavigator.Navigator>
    </NavigationContainer>
  )
}
