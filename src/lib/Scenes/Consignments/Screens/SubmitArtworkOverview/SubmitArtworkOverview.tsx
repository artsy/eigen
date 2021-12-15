import { track as _track } from "lib/utils/track"
import { Join, Separator, Spacer } from "palette"
import { CollapsibleMenuItem } from "palette/elements/Collapse/CollapsibleMenuItem/CollapsibleMenuItem"
import React, { useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"

export const ArtworkDetails: React.FC = ({}) => {
  return (
    <View style={{ backgroundColor: `rgba(255,145,125,.3)`, padding: 20, marginTop: 20 }}>
      <Text>ArtworkDetails content</Text>
    </View>
  )
}
export const ContactInformation: React.FC = ({}) => {
  return (
    <View style={{ backgroundColor: `rgba(255,145,125,.3)`, padding: 20, marginTop: 20 }}>
      <Text>ContactInformation content</Text>
    </View>
  )
}
export const UploadPhotos: React.FC = ({}) => {
  return (
    <View style={{ backgroundColor: `rgba(255,145,125,.3)`, padding: 20, marginTop: 20 }}>
      <Text>UploadPhotos content</Text>
    </View>
  )
}

export const SubmitArtworkOverview = () => {
  const totalSteps = 3
  const [activeStep, setActiveStep] = useState(1)
  const [enabledSteps, setEnabledSteps] = useState([1])
  // user must complete one step before being able to go to another. This is why we have "enabled" state

  const items = [
    { stepNumber: 1, title: "Artwork Details", Content: ArtworkDetails },
    { stepNumber: 2, title: "2nd component", Content: ContactInformation },
    { stepNumber: 3, title: "3nd component", Content: UploadPhotos },
  ]
  return (
    <ScrollView alwaysBounceVertical={false} contentContainerStyle={styles.scrollView}>
      <Spacer mb={3} />
      <Join separator={<Separator my={2} marginTop="40" marginBottom="20" />}>
        {items.map((item) => {
          const { stepNumber, title, Content } = item
          return (
            <CollapsibleMenuItem
              key={title}
              title={title}
              stepNumber={stepNumber}
              enabled={enabledSteps.includes(stepNumber)}
              totalSteps={totalSteps}
              activeStep={activeStep}
              enabledSteps={enabledSteps}
              setActiveStep={setActiveStep}
              setEnabledSteps={setEnabledSteps}
              Content={() => <Content />}
            />
          )
        })}
      </Join>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
})
