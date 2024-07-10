import { Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { SubmitArtworkAddDetails } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddDetails"
import { SubmitArtworkAddDimensions } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddDimensions"
import { SubmitArtworkAddPhoneNumber } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddPhoneNumber"
import { SubmitArtworkAddPhotos } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddPhotos"
import { SubmitArtworkAddTitle } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddTitle"
import { SubmitArtworkArtistRejected } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkArtistRejected"
import { SubmitArtworkBottomNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkBottomNavigation"
import { SubmitArtworkCompleteYourSubmission } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkCompleteYourSubmission"
import {
  SubmitArtworkFormStore,
  SubmitArtworkFormStoreProvider,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkFromMyCollection } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFromMyCollection"
import { SubmitArtworkPurchaseHistory } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkPurchaseHistory"
import { SubmitArtworkSelectArtist } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkSelectArtist"
import { SubmitArtworkStartFlow } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkStartFlow"
import { SubmitArtworkTopNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkTopNavigation"
import { SubmitArtworkScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"
import { getInitialNavigationState } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/getInitialNavigationState"
import {
  ArtworkDetailsFormModel,
  artworkDetailsEmptyInitialValues,
  getCurrentValidationSchema,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { fetchUserContactInformation } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/fetchUserContactInformation"
import { SubmitArtworkProps } from "app/Scenes/SellWithArtsy/SubmitArtwork/SubmitArtwork"
import { ArtsyKeyboardAvoidingView } from "app/utils/ArtsyKeyboardAvoidingView"
import { FormikProvider, useFormik } from "formik"
import { useEffect } from "react"
import { Keyboard } from "react-native"
import { isTablet as getIsTablet } from "react-native-device-info"

export type SubmitArtworkStackNavigation = {
  StartFlow: undefined
  SubmitArtworkFromMyCollection: undefined
  SelectArtist: undefined
  AddTitle: undefined
  AddPhotos: undefined
  AddDetails: undefined
  AddDimensions: undefined
  AddPhoneNumber: undefined
  PurchaseHistory: undefined
  CompleteYourSubmission: undefined
  ArtistRejected: undefined
}

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
    ...artworkDetailsEmptyInitialValues,
    ...injectedValuesProp,
  }

  const handleSubmit = (values: ArtworkDetailsFormModel) => {
    createOrUpdateSubmission(values, "")
  }

  const formik = useFormik<ArtworkDetailsFormModel>({
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
        <Flex
          style={{
            flex: 1,
          }}
        >
          <Flex flex={1}>
            <NavigationContainer
              independent
              ref={__unsafe__SubmissionArtworkFormNavigationRef}
              initialState={getInitialNavigationState(
                initialStep,
                // If the user started the flow from my collection
                // We don't want them to be able to go back to the start flow and select artist screens
                hasStartedFlowFromMyCollection ? ["StartFlow", "SelectArtist"] : []
              )}
            >
              <Stack.Navigator
                // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
                detachInactiveScreens={false}
                screenOptions={{
                  header: () => <SubmitArtworkTopNavigation />,
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
              </Stack.Navigator>
            </NavigationContainer>

            <SubmitArtworkBottomNavigation />
          </Flex>
        </Flex>
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
