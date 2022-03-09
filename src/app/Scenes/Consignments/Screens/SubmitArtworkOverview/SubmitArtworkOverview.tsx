import { OwnerType } from "@artsy/cohesion"
import { ContextModule } from "@artsy/cohesion"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack"
import { ArtsyKeyboardAvoidingView } from "app/Components/ArtsyKeyboardAvoidingView"
import { BackButton } from "app/navigation/BackButton"
import { goBack } from "app/navigation/navigate"
import { refreshMyCollection } from "app/Scenes/MyCollection/MyCollection"
import { GlobalStore } from "app/store/GlobalStore"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { CollapsibleMenuItem, Flex, Join, Separator, Spacer } from "palette"
import React, { useRef, useState } from "react"
import { ScrollView } from "react-native"
import { useTracking } from "react-tracking"
import { toggledAccordionEvent } from "../../Utils/TrackingEvent"
import { ArtworkDetails } from "./ArtworkDetails/ArtworkDetails"
import { ArtworkSubmittedScreen } from "./ArtworkSubmitted"
import { ContactInformationQueryRenderer } from "./ContactInformation/ContactInformation"
import { UploadPhotos } from "./UploadPhotos/UploadPhotos"

interface SubmitArtworkScreenNavigationProps
  extends StackScreenProps<SubmitArtworkOverviewNavigationStack, "SubmitArtworkScreen"> {}

export const SubmitArtworkScreen: React.FC<SubmitArtworkScreenNavigationProps> = ({
  navigation,
}) => {
  const items = [
    {
      overtitle: "Step 1 of 3",
      title: "Artwork Details",
      contextModule: ContextModule.artworkDetails,
      Content: (
        <ArtworkDetails
          handlePress={() => {
            expandCollapsibleMenuContent(1)
            enableStep(1)
          }}
        />
      ),
    },
    {
      overtitle: "Step 2 of 3",
      title: "Upload Photos",
      contextModule: ContextModule.uploadPhotos,
      Content: (
        <UploadPhotos
          handlePress={() => {
            expandCollapsibleMenuContent(2)
            enableStep(2)
          }}
        />
      ),
    },
    {
      overtitle: "Step 3 of 3",
      title: "Contact Information",
      contextModule: ContextModule.contactInformation,
      Content: (
        <ContactInformationQueryRenderer
          handlePress={(submissionId: string) => {
            refreshMyCollection()
            navigation.navigate("ArtworkSubmittedScreen", { submissionId })
          }}
        />
      ),
    },
  ]

  const TOTAL_STEPS = items.length

  // This is a temporary logic that will be removed later
  const [validSteps, setValidSteps] = useState([true, ...new Array(TOTAL_STEPS - 1).fill(false)])

  const { submissionId: submissionID } = GlobalStore.useAppState(
    (store) => store.artworkSubmission.submission
  )
  const { trackEvent } = useTracking()

  const stepsRefs = useRef<CollapsibleMenuItem[]>(new Array(TOTAL_STEPS).fill(null)).current
  const scrollViewRef = useRef<ScrollView>(null)

  // This will also be removed, it's temporary for the boilerplate
  const enableStep = (stepIndex: number) => {
    const newValidSteps = [...validSteps]
    newValidSteps[stepIndex] = true
    setValidSteps(newValidSteps)
  }

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
            <BackButton onPress={() => goBack()} style={{ top: 10 }} />
            <Spacer mb={3} />
            <Join separator={<Separator my={2} marginTop="40" marginBottom="20" />}>
              {items.map(({ overtitle, title, Content, contextModule }, index) => {
                const disabled = !validSteps[index]
                return (
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
                    disabled={disabled}
                    ref={(ref) => {
                      if (ref) {
                        stepsRefs[index] = ref
                      }
                    }}
                  >
                    {Content}
                  </CollapsibleMenuItem>
                )
              })}
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

export const SubmitArtworkOverview = () => {
  return (
    <NavigationContainer independent>
      <StackNavigator.Navigator
        headerMode="screen"
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
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
