import { Box, Button, Flex, Join, Separator, Spacer, Text } from "palette"
import { CollapsableMenuItem } from "palette"
import React, { useRef } from "react"
import { ScrollView } from "react-native"

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

export const SubmitArtworkOverview = () => {
  const stepsRefs = useRef<CollapsableMenuItem[]>(new Array(3).fill(null)).current

  const items = [
    {
      title: "Artwork Details",
      Content: (
        <ArtworkDetails
          handlePress={() => {
            stepsRefs[0].collapse()
            stepsRefs[1].expand()
          }}
        />
      ),
    },
    {
      title: "Upload Photos",
      Content: (
        <UploadPhotos
          handlePress={() => {
            stepsRefs[1].collapse()
            stepsRefs[2].expand()
          }}
        />
      ),
    },
    {
      title: "Contact Information",
      Content: (
        <ContactInformation
          handlePress={() => {
            // do nothing
          }}
        />
      ),
    },
  ]

  return (
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
          return (
            <CollapsableMenuItem
              key={index}
              Header={<StepTitle stepNumber={index + 1} totalSteps={items.length} title={title} />}
              isExpanded={index === 0}
              // isExpanded
              ref={(ref) => (stepsRefs[index] = ref)}
            >
              {Content}
            </CollapsableMenuItem>
          )
        })}
      </Join>
    </ScrollView>
  )
}
