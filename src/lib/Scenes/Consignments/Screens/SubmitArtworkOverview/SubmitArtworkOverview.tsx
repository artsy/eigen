import { track as _track } from "lib/utils/track"
import { Sans, Spacer, Text } from "palette"
import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { ArtworkDetailsContent } from "./ArtworkDetails"
import { CollapsibleMenuItem } from "./CollapsibleMenuItem"

export const SubmitArtworkOverview = () => {
  const totalSteps = 3
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    // console.log("\n\n ----------------------------- \n\n ")
  }, [activeStep])

  return (
    <ScrollView
      alwaysBounceVertical={false}
      contentContainerStyle={{
        paddingVertical: 20,
        justifyContent: "center",
      }}
    >
      <Spacer mb={3} />
      <CollapsibleMenuItem
        title="Artwork Details"
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        Content={() => <ArtworkDetailsContent />}
        step={1}
        totalSteps={totalSteps}
      />
      <CollapsibleMenuItem
        title="Upload Photos"
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        Content={() => (
          <Sans size="1" mt="1">
            Upload Photos Content
          </Sans>
        )}
        step={2}
        totalSteps={totalSteps}
      />
      <CollapsibleMenuItem
        title="Contact Information"
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        Content={() => (
          <Sans size="1" mt="1">
            Contact Information Content
          </Sans>
        )}
        step={3}
        totalSteps={totalSteps}
      />
    </ScrollView>
  )
}
