import React, { useState } from "react"
import { BorderBox, Button, Sans, Flex } from "@artsy/palette"
import { PhotosSection } from "../PhotosSection"
import { ArtistSection } from "../ArtistSection"
import { MediumSection } from "../MediumSection"

const photosRoute = {
  component: PhotosSection,
  title: "Add photos",
}

const artistRoute = {
  component: ArtistSection,
  title: "Artist",
}

const mediumRoute = {
  component: MediumSection,
  title: "Select Medium",
}

interface SummaryProps {
  pushRoute: (route: any) => void
}

export const Summary: React.FC<SummaryProps> = props => {
  const [photosDone, setPhotosDone] = useState(false)
  const [artistDone, setArtistDone] = useState(false)
  const [mediumDone, setMediumDone] = useState(false)

  const handlePhotosPress = () => {
    props.pushRoute(photosRoute)
    setPhotosDone(true)
  }

  const handleArtistPress = () => {
    props.pushRoute(artistRoute)
    setArtistDone(true)
  }

  const handleMediumPress = () => {
    props.pushRoute(mediumRoute)
    setMediumDone(true)
  }

  return (
    <>
      <BorderBox height="200" my="4">
        <Flex flexDirection="row" justifyContent="space-between">
          <Button inline onPress={handlePhotosPress} variant="noOutline">
            [camera icon]
          </Button>
          {photosDone && <Done />}
        </Flex>
      </BorderBox>
      <BorderBox mb="4">
        <Flex flexDirection="row" justifyContent="space-between">
          <Button inline onPress={handleArtistPress} variant="noOutline">
            Artist*
          </Button>
          {artistDone && <Done />}
        </Flex>
      </BorderBox>
      <BorderBox mb="4">
        <Flex flexDirection="row" justifyContent="space-between">
          <Button inline onPress={handleMediumPress} variant="noOutline">
            Medium*
          </Button>
          {mediumDone && <Done />}
        </Flex>
      </BorderBox>
    </>
  )
}

const Done: React.FC = () => {
  return <Sans size="2">done!</Sans>
}
