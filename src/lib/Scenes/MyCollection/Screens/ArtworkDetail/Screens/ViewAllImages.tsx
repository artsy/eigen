import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { AppStore } from "lib/store/AppStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Spacer } from "palette"
import React from "react"
import { ScrollView, View } from "react-native"
import { MyCollectionArtworkMeta } from "../Components/MyCollectionArtworkMeta"

export const ViewAllImages: React.FC<any /* TODO */> = ({ images }) => {
  const { navigation: navActions } = AppStore.actions.myCollection
  const dimensions = useScreenDimensions()

  return (
    <>
      <FancyModalHeader onLeftButtonPress={() => navActions.goBack()}>
        {images.length} Photo{!!images.length && "s"}
      </FancyModalHeader>
      <ScrollView>
        {images.map((image, index) => (
          <View key={index}>
            <OpaqueImageView
              // TODO: figure out if "normalized" is the correct version
              imageURL={image.url?.replace(":version", "normalized")}
              height={(dimensions.width / image.width) * image.height}
              width={dimensions.width}
            />
            <Spacer my={1} />
          </View>
        ))}
      </ScrollView>
    </>
  )
}
