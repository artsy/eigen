import { track as _track } from "lib/utils/track"
import { Join, Separator, Spacer } from "palette"
import { CollapsibleMenuItem } from "palette/elements/Collapse/CollapsibleMenuItem/CollapsibleMenuItem"
import React, { useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
// import { ArtworkDetails } from "./ArtworkDetails"
// import { ContactInformation } from "./ContactInformation"
// import { UploadPhotos } from "./UploadPhotos"

export const SubmitArtworkOverview = () => {
  const totalSteps = 3
  const [activeStep, setActiveStep] = useState(1)
  const [enabledSteps, setEnabledSteps] = useState([1])

  // user must complete one step before being able to go to another. This is why we have "enabled" state

  return (
    <ScrollView alwaysBounceVertical={false} contentContainerStyle={styles.scrollView}>
      <Spacer mb={3} />
      <Join separator={<Separator my={2} marginTop="40" marginBottom="20" />}>
        <CollapsibleMenuItem
          stepNumber={1}
          enabled={!!enabledSteps.includes(1)}
          totalSteps={totalSteps}
          activeStep={activeStep}
          enabledSteps={enabledSteps}
          setActiveStep={setActiveStep}
          setEnabledSteps={setEnabledSteps}
          title="Artwork Details"
        />
        <CollapsibleMenuItem
          stepNumber={2}
          enabled={!!enabledSteps.includes(2)}
          totalSteps={totalSteps}
          activeStep={activeStep}
          enabledSteps={enabledSteps}
          setActiveStep={setActiveStep}
          setEnabledSteps={setEnabledSteps}
          title="Upload Photos"
        />
        <CollapsibleMenuItem
          stepNumber={3}
          enabled={!!enabledSteps.includes(3)}
          totalSteps={totalSteps}
          activeStep={activeStep}
          enabledSteps={enabledSteps}
          setActiveStep={setActiveStep}
          setEnabledSteps={setEnabledSteps}
          title="Contact Information"
          navigateToLink="artwork-submitted"
        />
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
