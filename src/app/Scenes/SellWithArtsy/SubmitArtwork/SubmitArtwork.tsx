import { OwnerType } from "@artsy/cohesion"
import { ContextModule } from "@artsy/cohesion"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack"
import { BackButton } from "app/navigation/BackButton"
import { goBack } from "app/navigation/navigate"
import { addClue, GlobalStore, useFeatureFlag } from "app/store/GlobalStore"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { isEqual } from "lodash"
import { CollapsibleMenuItem, Flex, Join, Separator, Spacer } from "palette"
import React, { useRef, useState } from "react"
import { ScrollView } from "react-native"
import { useTracking } from "react-tracking"
import { ArtsyKeyboardAvoidingView } from "shared/utils"
import {
  artworkDetailsCompletedEvent,
  consignmentSubmittedEvent,
  toggledAccordionEvent,
  uploadPhotosCompletedEvent,
} from "../utils/TrackingEvent"
import { ArtworkDetails } from "./ArtworkDetails/ArtworkDetails"
import { createOrUpdateSubmission } from "./ArtworkDetails/utils/createOrUpdateSubmission"
import { ArtworkDetailsFormModel } from "./ArtworkDetails/validation"
import { ArtworkSubmittedScreen } from "./ArtworkSubmitted"
import { ContactInformationQueryRenderer } from "./ContactInformation/ContactInformation"
import { ContactInformationFormModel } from "./ContactInformation/validation"
import { UploadPhotos } from "./UploadPhotos/UploadPhotos"

enum STEPS {
  ArtworkDetails = "ArtworkDetails",
  UploadPhotos = "UploadPhotos",
  ContactInformation = "ContactInformation",
}

const DEFAULT_STEPS_IN_ORDER: STEPS[] = [
  STEPS.ArtworkDetails,
  STEPS.UploadPhotos,
  STEPS.ContactInformation,
]

interface SubmitArtworkScreenNavigationProps
  extends StackScreenProps<SubmitArtworkOverviewNavigationStack, "SubmitArtworkScreen"> {}

export const SubmitArtworkScreen: React.FC<SubmitArtworkScreenNavigationProps> = ({
  navigation,
}) => {
  const { trackEvent } = useTracking()
  const { showActionSheetWithOptions } = useActionSheet()
  const {
    submissionId: submissionID,
    artworkDetails,
    dirtyArtworkDetailsValues,
  } = GlobalStore.useAppState((store) => store.artworkSubmission.submission)

  const { userID, userEmail } = GlobalStore.useAppState((state) => state.auth)

  const [desiredEmail, setDesiredEmail] = useState(userEmail)

  const [activeStep, setActiveStep] = useState(0)

  const artworkDetailsFromValuesRef = useRef(artworkDetails)
  artworkDetailsFromValuesRef.current = artworkDetails

  const enableReorderedSubmissionFlow = useFeatureFlag("ARReorderSWAArtworkSubmissionFlow")

  const STEPS_IN_ORDER: typeof DEFAULT_STEPS_IN_ORDER = enableReorderedSubmissionFlow
    ? [STEPS.ContactInformation, STEPS.ArtworkDetails, STEPS.UploadPhotos]
    : DEFAULT_STEPS_IN_ORDER

  const track = (id: string, email?: string | null) => {
    if (activeStep === STEPS_IN_ORDER.length - 1) {
      trackEvent(consignmentSubmittedEvent(id, email, userID))
    }

    const step = STEPS_IN_ORDER[activeStep]

    if (step === STEPS.ArtworkDetails) {
      trackEvent(artworkDetailsCompletedEvent(id, email, userID))
    } else if (step === STEPS.UploadPhotos) {
      trackEvent(uploadPhotosCompletedEvent(id, email, userID))
    } else if (step === STEPS.ContactInformation) {
      // TODO:- Track ContactInformation https://artsyproduct.atlassian.net/browse/CX-3106
    }
  }

  const handlePress = async (
    formValues: ArtworkDetailsFormModel | ContactInformationFormModel | {}
  ) => {
    const isLastStep = activeStep === STEPS_IN_ORDER.length - 1
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

        if (activeStep === STEPS_IN_ORDER.length - 1) {
          refreshMyCollection()
          GlobalStore.actions.artworkSubmission.submission.resetSessionState()
          addClue("ArtworkSubmissionMessage")
          return navigation.navigate("ArtworkSubmittedScreen", { submissionId: id })
        }

        GlobalStore.actions.artworkSubmission.submission.setSubmissionId(id)

        if (STEPS_IN_ORDER[activeStep] === STEPS.ArtworkDetails) {
          GlobalStore.actions.artworkSubmission.submission.setArtworkDetailsForm(
            formValues as ArtworkDetailsFormModel
          )
        }
      }
    } catch (error) {
      console.error("Error", error)
      return
    }

    if (email && email !== desiredEmail) {
      setDesiredEmail(email)
    }
    expandCollapsibleMenuContent(activeStep + 1)
    setActiveStep(activeStep + 1)
  }

  const items = STEPS_IN_ORDER.map((step, index) => {
    const staticValues = { overtitle: `Step ${index + 1} of ${STEPS_IN_ORDER.length}` }
    const isLastStep = index === STEPS_IN_ORDER.length - 1
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
      <ArtsyKeyboardAvoidingView>
        <Flex>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{
              paddingVertical: 20,
              paddingHorizontal: 20,
              justifyContent: "center",
            }}
          >
            <BackButton onPress={handleBackPress} style={{ top: 10 }} />
            <Spacer mb={3} />
            <Join separator={<Separator my={2} marginTop="40" marginBottom="20" />}>
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
          </ScrollView>
        </Flex>
      </ArtsyKeyboardAvoidingView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

// tslint:disable-next-line:interface-over-type-literal
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
