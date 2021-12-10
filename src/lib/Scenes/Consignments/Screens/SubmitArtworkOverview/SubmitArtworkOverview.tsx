import { track as _track } from "lib/utils/track"
import { Join, Separator, Spacer } from "palette"
import { CollapsibleMenuItemInactive } from "palette/elements/Collapse/CollapsibleMenuItem/CollapsibleMenuItemInactive"
import React, { useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { ArtworkDetails } from "./ArtworkDetails"
import { ContactInformation } from "./ContactInformation"
import { UploadPhotos } from "./UploadPhotos"

export const SubmitArtworkOverview = () => {
  const totalSteps = 3
  const [activeStep, setActiveStep] = useState(1)
  const [stepsCompleted, setStepsCompleted] = useState<number[]>([0])

  return (
    <ScrollView alwaysBounceVertical={false} contentContainerStyle={styles.scrollView}>
      <Spacer mb={3} />
      <Join separator={<Separator my={2} marginTop="40" marginBottom="20" />}>
        <ArtworkDetails
          title="Artwork Details"
          activeStep={activeStep}
          step={1}
          totalSteps={totalSteps}
          setActiveStep={setActiveStep}
          setStepsCompleted={setStepsCompleted}
          stepsCompleted={stepsCompleted}
        />
        {!stepsCompleted.includes(1) ? (
          <CollapsibleMenuItemInactive title="Artwork Details" step={2} totalSteps={totalSteps} />
        ) : (
          <UploadPhotos
            title="Artwork Details"
            activeStep={activeStep}
            step={2}
            totalSteps={totalSteps}
            setActiveStep={setActiveStep}
            setStepsCompleted={setStepsCompleted}
            stepsCompleted={stepsCompleted}
          />
        )}
        {!(stepsCompleted.includes(1) && stepsCompleted.includes(2)) ? (
          <CollapsibleMenuItemInactive title="Contact Information" step={3} totalSteps={totalSteps} />
        ) : (
          <ContactInformation
            title="Contact Information"
            activeStep={activeStep}
            step={3}
            totalSteps={totalSteps}
            setActiveStep={setActiveStep}
            setStepsCompleted={setStepsCompleted}
            stepsCompleted={stepsCompleted}
          />
        )}
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
