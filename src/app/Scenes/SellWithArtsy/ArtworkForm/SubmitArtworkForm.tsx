import { Flex } from "@artsy/palette-mobile"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { TransitionPresets, createStackNavigator } from "@react-navigation/stack"
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
import { SubmitArtworkPurchaseHistory } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkPurchaseHistory"
import { SubmitArtworkSelectArtist } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkSelectArtist"
import { SelectArtworkMyCollectionArtwork } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkSelectArtworkMyCollectionArtwork"
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
import { useIsKeyboardVisible } from "app/utils/hooks/useIsKeyboardVisible"
import { FormikProvider, useFormik } from "formik"
import { useEffect } from "react"
import { Keyboard } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export type SubmitArtworkStackNavigation = {
  StartFlow: undefined
  SelectArtworkMyCollectionArtwork: undefined
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
      />
    </SubmitArtworkFormStoreProvider>
  )
}

const SubmitArtworkFormContent: React.FC<SubmitArtworkProps> = ({
  initialValues: injectedValuesProp,
  initialStep,
}) => {
  const currentStep = SubmitArtworkFormStore.useStoreState((state) => state.currentStep)
  const { bottom: bottomInset } = useSafeAreaInsets()
  const isKeyboardVisible = useIsKeyboardVisible(true)

  const initialValues = {
    ...artworkDetailsEmptyInitialValues,
    ...injectedValuesProp,
  }

  const handleSubmit = (values: ArtworkDetailsFormModel) => {
    createOrUpdateSubmission(values, "")
  }

  const formik = useFormik<ArtworkDetailsFormModel>({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: handleSubmit,
    validationSchema: getCurrentValidationSchema,
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

  return (
    <FormikProvider value={formik}>
      <ArtsyKeyboardAvoidingView>
        <SubmitArtworkTopNavigation />
        <Flex
          style={{
            flex: 1,
            paddingBottom: isKeyboardVisible ? 0 : bottomInset,
          }}
        >
          <NavigationContainer
            independent
            ref={__unsafe__SubmissionArtworkFormNavigationRef}
            initialState={getInitialNavigationState(initialStep)}
          >
            <Stack.Navigator
              // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
              detachInactiveScreens={false}
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: "white" },
                gestureEnabled: false,
                ...TransitionPresets.SlideFromRightIOS,
                cardStyleInterpolator: ({ current, layouts }) => {
                  return {
                    cardStyle: {
                      transform: [
                        {
                          translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                          }),
                        },
                      ],
                    },
                  }
                },
              }}
              initialRouteName={initialStep}
            >
              <Stack.Screen name="StartFlow" component={SubmitArtworkStartFlow} />

              <Stack.Screen
                name="SelectArtworkMyCollectionArtwork"
                component={SelectArtworkMyCollectionArtwork}
              />

              <Stack.Screen name="AddPhoneNumber" component={SubmitArtworkAddPhoneNumber} />
              <Stack.Screen name="SelectArtist" component={SubmitArtworkSelectArtist} />
              <Stack.Screen
                name="ArtistRejected"
                component={SubmitArtworkArtistRejected}
                options={{
                  // We want to make it easy for users to go back to the previous screen
                  // And to submit a new artist
                  gestureEnabled: true,
                }}
              />

              <Stack.Screen name="AddTitle" component={SubmitArtworkAddTitle} />

              <Stack.Screen name="AddPhotos" component={SubmitArtworkAddPhotos} />

              <Stack.Screen name="AddDetails" component={SubmitArtworkAddDetails} />

              <Stack.Screen name="AddDimensions" component={SubmitArtworkAddDimensions} />

              <Stack.Screen name="PurchaseHistory" component={SubmitArtworkPurchaseHistory} />

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
