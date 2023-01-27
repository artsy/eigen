import {
  ViroARPlane,
  ViroARScene,
  ViroARSceneNavigator,
  ViroImage,
  ViroTrackingStateConstants,
} from "@viro-community/react-viro"
import React, { useEffect, useState } from "react"

let source: string
let height: number
let width: number

const HelloWorldSceneAR = () => {
  const [image, setImage] = useState(null)

  function onInitialized(state: number) {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setImage(
        // @ts-ignore
        <ViroImage source={{ uri: source }} height={height} width={width} rotation={[0, 0, 0]} />
      )
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking
    }
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroARPlane minHeight={0.5} minWidth={0.5} alignment="Horizontal">
        {image}
      </ViroARPlane>
    </ViroARScene>
  )
}

export const ArtworkViewInRoom = (props: { source: string; height: number; width: number }) => {
  useEffect(() => {
    console.log("artwork view in room")
    source = props.source
    height = props.height
    width = props.width
  }, [])
  return (
    <ViroARSceneNavigator
      autofocus
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={{ flex: 1 }}
    />
  )
}
