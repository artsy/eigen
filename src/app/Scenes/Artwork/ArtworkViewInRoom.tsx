import {
  ViroARPlane,
  ViroARScene,
  ViroARSceneNavigator,
  ViroImage,
  ViroTrackingStateConstants,
} from "@viro-community/react-viro"
import React, { useEffect, useState } from "react"
import { StyleSheet } from "react-native"

let source
let height
let width

const HelloWorldSceneAR = () => {
  const [image, setImage] = useState(null)

  function onInitialized(state, reason) {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setImage(
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

export const ArtworkViewInRoom = (props) => {
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
