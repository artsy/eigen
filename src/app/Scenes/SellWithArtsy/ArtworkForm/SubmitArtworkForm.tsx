import { useScreenDimensions } from "@artsy/palette-mobile"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { SubmitArtworkAddDetails } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddDetails"
import { SubmitArtworkAddDimensions } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddDimensions"
import { SubmitArtworkAddPhoneNumber } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddPhoneNumber"
import { SubmitArtworkAddPhotos } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddPhotos"
import { SubmitArtworkAddTitle } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddTitle"
import { SubmitArtworkAdditionalDocuments } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAdditionalDocuments"
import { SubmitArtworkArtistRejected } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkArtistRejected"
import { SubmitArtworkBottomNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkBottomNavigation"
import { SubmitArtworkCompleteYourSubmission } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkCompleteYourSubmission"
import { SubmitArtworkCondition } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkCondition"
import {
  SubmitArtworkFormStore,
  SubmitArtworkFormStoreProvider,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkFrameInformation } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFrameInformation"
import { SubmitArtworkFromMyCollection } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFromMyCollection"
import { SubmitArtworkPurchaseHistory } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkPurchaseHistory"
import { SubmitArtworkSelectArtist } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkSelectArtist"
import { SubmitArtworkShippingLocation } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkShippingLocation"
import { SubmitArtworkStartFlow } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkStartFlow"
import { SubmitArtworkTopNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkTopNavigation"
import {
  SUBMIT_ARTWORK_APPROVED_SUBMISSION_STEPS,
  SUBMIT_ARTWORK_DRAFT_SUBMISSION_STEPS,
  SubmitArtworkScreen,
  TIER_1_STATES,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"
import { getInitialNavigationState } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/getInitialNavigationState"
import {
  getCurrentValidationSchema,
  SubmissionModel,
  submissionModelInitialValues,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { fetchUserContactInformation } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/fetchUserContactInformation"
import { routingInstrumentation } from "app/system/errorReporting/sentrySetup"
import { ArtsyKeyboardAvoidingView } from "app/utils/ArtsyKeyboardAvoidingView"
import { FormikProvider, useFormik } from "formik"
import { useEffect } from "react"
import { Keyboard } from "react-native"
import { isTablet as getIsTablet } from "react-native-device-info"

export type SubmitArtworkStackNavigation = {
  StartFlow: undefined
  CompleteYourSubmission: undefined
  CompleteYourSubmissionPostApproval: undefined
  ArtistRejected: undefined

  // Tier 1 Steps
  SubmitArtworkFromMyCollection: undefined
  SelectArtist: undefined
  AddTitle: undefined
  AddPhotos: undefined
  AddDetails: undefined
  AddDimensions: undefined
  AddPhoneNumber: undefined
  PurchaseHistory: undefined

  // Tier 2 Steps
  ShippingLocation: undefined
  FrameInformation: undefined
  AdditionalDocuments: undefined
  Condition: undefined
}

export interface SubmitArtworkProps {
  initialValues: Partial<SubmissionModel>
  initialStep: SubmitArtworkScreen
  navigationState?: string
  externalID?: string
  hasStartedFlowFromMyCollection?: boolean
}

export const INITIAL_EDIT_STEP: keyof SubmitArtworkStackNavigation = "AddTitle"
export const INITIAL_POST_APPROVAL_STEP: keyof SubmitArtworkStackNavigation = "ShippingLocation"

export const SubmitArtworkForm: React.FC<SubmitArtworkProps> = (props) => {
  const initialScreen: SubmitArtworkScreen = props.initialStep || "StartFlow"

  return (
    <SubmitArtworkFormStoreProvider
      runtimeModel={{
        currentStep: initialScreen,
      }}
    >
      <SubmitArtworkFormContent
        initialValues={props.initialValues}
        initialStep={initialScreen}
        navigationState={props.navigationState}
        hasStartedFlowFromMyCollection={props.hasStartedFlowFromMyCollection}
      />
    </SubmitArtworkFormStoreProvider>
  )
}

const SubmitArtworkFormContent: React.FC<SubmitArtworkProps> = ({
  initialValues: injectedValuesProp,
  initialStep,
  hasStartedFlowFromMyCollection,
}) => {
  const currentStep = SubmitArtworkFormStore.useStoreState((state) => state.currentStep)

  const initialValues = {
    ...submissionModelInitialValues,
    ...injectedValuesProp,
  }

  const handleSubmit = (values: SubmissionModel) => {
    createOrUpdateSubmission(values, "")
  }

  const formik = useFormik<SubmissionModel>({
    enableReinitialize: true,
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: getCurrentValidationSchema,
    validateOnChange: false,
  })

  useEffect(() => {
    fetchUserContactInformation()
      .then((me) => {
        if (me.email) {
          formik.setFieldValue("userEmail", me.email)
        }
        if (me.phoneNumber?.isValid && me.phoneNumber?.originalNumber) {
          formik.setFieldValue("userPhone", me.phoneNumber.originalNumber)
        }
        if (me.name) {
          formik.setFieldValue("userName", me.name)
        }
      })
      .catch((error) => {
        console.error("Error fetching user contact information", error)
      })
  }, [])

  // Revalidate form on step change because the validation schema changes and it does not happen automatically
  useEffect(() => {
    formik.validateForm()
    Keyboard.dismiss()
  }, [currentStep])

  const isTablet = getIsTablet()
  const { width: screenWidth } = useScreenDimensions()

  return (
    <FormikProvider value={formik}>
      <ArtsyKeyboardAvoidingView>
        <NavigationContainer
          independent
          ref={__unsafe__SubmissionArtworkFormNavigationRef}
          initialState={getInitialNavigationState({
            initialStep,
            // If the user started the flow from my collection
            // We don't want them to be able to go back to the start flow and select artist screens
            skippedSteps: hasStartedFlowFromMyCollection
              ? ["StartFlow", "SelectArtist", "SubmitArtworkFromMyCollection"]
              : [],
            steps:
              formik.values.state === "APPROVED"
                ? SUBMIT_ARTWORK_APPROVED_SUBMISSION_STEPS
                : SUBMIT_ARTWORK_DRAFT_SUBMISSION_STEPS,
          })}
          onReady={() => {
            routingInstrumentation.registerNavigationContainer(
              __unsafe__SubmissionArtworkFormNavigationRef
            )
          }}
        >
          <SubmitArtworkTopNavigation />
          <Stack.Navigator
            // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
            detachInactiveScreens={false}
            screenOptions={{
              headerShown: false,
              cardStyle: {
                backgroundColor: "white",
                ...(isTablet
                  ? {
                      paddingTop: 20,
                      width: isTablet ? Math.min(800, screenWidth) : undefined,
                      alignSelf: "center",
                    }
                  : {}),
              },
              transitionSpec: {
                open: {
                  animation: "timing",
                  config: {
                    duration: 300,
                  },
                },
                close: {
                  animation: "timing",
                  config: {
                    duration: 300,
                  },
                },
              },
              cardStyleInterpolator: ({ current, next }) => {
                const opacity = current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                })

                const nextOpacity = next
                  ? next.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.2], // Lower the opacity of the exiting screen
                    })
                  : 1

                return {
                  cardStyle: {
                    opacity: next ? nextOpacity : opacity,
                    backgroundColor: "white",
                  },
                  overlayStyle: {
                    opacity: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.5],
                    }),
                    backgroundColor: "white",
                  },
                }
              },
            }}
            initialRouteName={initialStep}
          >
            {!hasStartedFlowFromMyCollection && (
              <Stack.Screen name="StartFlow" component={SubmitArtworkStartFlow} />
            )}

            <Stack.Screen
              name="SubmitArtworkFromMyCollection"
              component={SubmitArtworkFromMyCollection}
            />

            {!hasStartedFlowFromMyCollection && (
              <Stack.Screen name="SelectArtist" component={SubmitArtworkSelectArtist} />
            )}

            <Stack.Screen name="ArtistRejected" component={SubmitArtworkArtistRejected} />

            <Stack.Screen name="AddTitle" component={SubmitArtworkAddTitle} />

            <Stack.Screen name="AddPhotos" component={SubmitArtworkAddPhotos} />

            <Stack.Screen name="AddDetails" component={SubmitArtworkAddDetails} />

            <Stack.Screen name="AddDimensions" component={SubmitArtworkAddDimensions} />

            <Stack.Screen name="PurchaseHistory" component={SubmitArtworkPurchaseHistory} />

            <Stack.Screen name="AddPhoneNumber" component={SubmitArtworkAddPhoneNumber} />

            <Stack.Screen
              name="CompleteYourSubmission"
              component={SubmitArtworkCompleteYourSubmission}
              // Do not allow the user to go back to the previous screen
              options={{ gestureEnabled: false }}
            />

            {!!formik.values.state && !TIER_1_STATES.includes(formik.values.state) && (
              <>
                <Stack.Screen name="ShippingLocation" component={SubmitArtworkShippingLocation} />
                <Stack.Screen name="FrameInformation" component={SubmitArtworkFrameInformation} />
                <Stack.Screen
                  name="AdditionalDocuments"
                  component={SubmitArtworkAdditionalDocuments}
                />
                <Stack.Screen name="Condition" component={SubmitArtworkCondition} />
              </>
            )}
          </Stack.Navigator>
          <SubmitArtworkBottomNavigation />
        </NavigationContainer>
      </ArtsyKeyboardAvoidingView>
    </FormikProvider>
  )
}

const Stack = createStackNavigator<SubmitArtworkStackNavigation>()

export const __unsafe__SubmissionArtworkFormNavigationRef: React.MutableRefObject<NavigationContainerRef<any> | null> =
  {
    current: null,
  }

export const getCurrentRoute = () =>
  __unsafe__SubmissionArtworkFormNavigationRef.current?.getCurrentRoute()?.name as
    | keyof SubmitArtworkStackNavigation
    | undefined
