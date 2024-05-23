import { Flex, useSpace } from "@artsy/palette-mobile"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationRoute } from "@sentry/react-native/dist/js/tracing/reactnavigation"
import { SubmitArtworkAddDetails } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddDetails"
import { SubmitArtworkAddDimensions } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddDimensions"
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
import {
  ARTWORK_FORM_STEPS,
  SubmitArtworkScreen,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"
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
import { useEffect, useRef } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export type SubmitArtworkStackNavigation = {
  StartFlow: undefined
  SelectArtworkMyCollectionArtwork: undefined
  SelectArtist: undefined
  AddTitle: undefined
  AddPhotos: undefined
  AddDetails: undefined
  AddDimensions: undefined
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
  navigationState = undefined,
}) => {
  const currentStep = SubmitArtworkFormStore.useStoreState((state) => state.currentStep)
  const space = useSpace()

  const navigationStateRef = useRef(
    navigationState && isValidJsonString(navigationState) ? JSON.parse(navigationState) : undefined
  )

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
  }, [currentStep])

  return (
    <FormikProvider value={formik}>
      <ArtsyKeyboardAvoidingView>
        <SubmitArtworkTopNavigation />
        <Flex
          style={{
            flex: 1,
            paddingBottom: isKeyboardVisible ? 0 : bottomInset,
            paddingHorizontal: space(2),
          }}
        >
          <NavigationContainer
            independent
            ref={__unsafe__SubmissionArtworkFormNavigationRef}
            initialState={getInitialNavigationState(navigationStateRef)}
          >
            <Stack.Navigator
              // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
              detachInactiveScreens={false}
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: "white" },
                keyboardHandlingEnabled: false,
                gestureEnabled: false,
              }}
              initialRouteName={initialStep}
            >
              <Stack.Screen name="StartFlow" component={SubmitArtworkStartFlow} />

              <Stack.Screen
                name="SelectArtworkMyCollectionArtwork"
                component={SelectArtworkMyCollectionArtwork}
              />

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

const isValidJsonString = (str: string) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

// Helper function to get the initial navigation state from the injected navigation state
// Because the injected navigation state might contain invalid routes or an invalid index
// We need to filter them out and inject and a partial state
// See: https://reactnavigation.org/docs/navigation-state/#partial-state-objects
// This can only happen if we changed the order of the screen or renamed them
// Hopefully, this will never happen once the feature becomes mature
const getInitialNavigationState = (navigationStateRef: React.MutableRefObject<any>) => {
  const oldRoutesCount = navigationStateRef.current?.routes.length
  const validRoutesCount: SubmitArtworkScreen[] = navigationStateRef.current?.routes.filter(
    (route: NavigationRoute) => {
      // Ideally, the type here is SubmitArtworkScreen
      // But we might change a screen name in the futrue and that might break the continue submission flow
      // Because react-navigation won't know what is the active route
      // This is why we need to validate the injected routes
      // @ts-expect-error
      return ARTWORK_FORM_STEPS.includes(route.name)
    }
  ).length

  if (validRoutesCount !== oldRoutesCount) {
    return undefined
  }

  return navigationStateRef.current
}
