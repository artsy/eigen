import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack"
import { BackButton } from "lib/navigation/BackButton"
import { Box, Button, CollapsableMenuItem, Flex, Join, Separator, Spacer, Text } from "palette"
import React, { useRef, useState } from "react"
import { ScrollView } from "react-native"
import { ArtworkSubmittedScreen } from "./ArtworkSubmitted"

const CTAButton = ({ onPress, text }: { onPress: () => void; text: string }) => (
  <Button block haptic maxWidth={540} onPress={onPress}>
    {text}
  </Button>
)
export const ArtworkDetails = ({ handlePress }: { handlePress: () => void }) => {
  return (
    <Flex backgroundColor="darkorange" p={1} mt={1}>
      <Text>ArtworkDetails content</Text>
      <Spacer mt={1} />
      <CTAButton text="Save & Continue" onPress={handlePress} />
    </Flex>
  )
}

export const UploadPhotos = ({ handlePress }: { handlePress: () => void }) => {
  return (
    <Flex backgroundColor="darkorange" p={1} mt={1}>
      <Text>Upload Photos content</Text>
      <Spacer mt={1} />
      <CTAButton text="Save & Continue" onPress={handlePress} />
    </Flex>
  )
}

export const ContactInformation = ({ handlePress }: { handlePress: () => void }) => {
  return (
    <Flex backgroundColor="darkorange" p={1} mt={1}>
      <Text>ContactInformation content</Text>
      <Spacer mt={1} />
      <CTAButton text="Submit Artwork" onPress={handlePress} />
    </Flex>
  )
}

const StepTitle = ({
  stepNumber,
  totalSteps,
  title,
  disabled,
}: {
  stepNumber: number
  totalSteps: number
  title: string
  disabled?: boolean
}) => (
  <Box>
    <Text variant="sm" color={disabled ? "black30" : "black100"}>
      Step {stepNumber} of {totalSteps}
    </Text>
    <Text variant="lg" color={disabled ? "black30" : "black100"}>
      {title}
    </Text>
  </Box>
)

const TOTAL_STEPS = 3

interface SubmitArtworkScreenNavigationProps
  extends StackScreenProps<SubmitArtworkOverviewNavigationStack, "SubmitArtworkScreen"> {}

export const SubmitArtworkScreen: React.FC<SubmitArtworkScreenNavigationProps> = ({ navigation }) => {
  // This is a temporary logic that will be removed later
  const [validSteps, setValidSteps] = useState([true, ...new Array(TOTAL_STEPS - 1).fill(false)])

  const stepsRefs = useRef<CollapsableMenuItem[]>(new Array(TOTAL_STEPS).fill(null)).current

  // This will also be removed, it's temporary for the boilerplate
  const enableStep = (stepIndex: number) => {
    const newValidSteps = [...validSteps]
    newValidSteps[stepIndex] = true
    setValidSteps(newValidSteps)
  }

  const items = [
    {
      title: "Artwork Details",
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
      title: "Upload Photos",
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
      title: "Contact Information",
      Content: (
        <ContactInformation
          handlePress={() => {
            navigation.navigate("ArtworkSubmittedScreen")
            // do nothing
          }}
        />
      ),
    },
  ]

  const expandCollapsibleMenuContent = (indexToExpand: number) => {
    items.forEach((_, index) => {
      if (indexToExpand !== index) {
        stepsRefs[index].collapse()
      } else {
        stepsRefs[index].expand()
      }
    })
  }

  return (
    <Flex>
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 20,
          paddingHorizontal: 20,
          justifyContent: "center",
        }}
      >
        <Spacer mb={3} />
        <Join separator={<Separator my={2} marginTop="40" marginBottom="20" />}>
          {items.map(({ title, Content }, index) => {
            const disabled = !validSteps[index]
            return (
              <CollapsableMenuItem
                key={index}
                Header={
                  <StepTitle stepNumber={index + 1} totalSteps={items.length} title={title} disabled={disabled} />
                }
                onExpand={() => expandCollapsibleMenuContent(index)}
                isExpanded={index === 0}
                disabled={disabled}
                ref={(ref) => {
                  if (ref) {
                    stepsRefs[index] = ref
                  }
                }}
              >
                {Content}
              </CollapsableMenuItem>
            )
          })}
        </Join>
      </ScrollView>
      <Flex position="absolute" top={-50} left={0}>
        <BackButton />
      </Flex>
    </Flex>
  )
}

// tslint:disable-next-line:interface-over-type-literal
export type SubmitArtworkOverviewNavigationStack = {
  SubmitArtworkScreen: undefined
  ArtworkSubmittedScreen: undefined
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
