import { AppStore } from "lib/store/AppStore"
import { Flex, Sans } from "palette"
import React from "react"
import { ArrowButton } from "./ArrowButton"

export const PhotoPicker: React.FC = () => {
  return (
    <ArrowButton onPress={() => AppStore.actions.myCollection.navigation.navigateToAddArtworkPhotos()}>
      <Flex flexDirection="row">
        <Sans size="3" weight="medium">
          Photos
        </Sans>
        <Sans size="3" ml="2px">
          (optional)
        </Sans>
      </Flex>
      <Sans size="3">3 photos added</Sans>
    </ArrowButton>
  )
}

// FIXME: Return to below once RFC is resolved: https://github.com/artsy/eigen/issues/3473

// import { Button } from "palette"
// import React from "react"
// import ImagePicker from "react-native-image-picker"

// /**
//  * @see https://github.com/react-native-community/react-native-image-picker
//  *
//  * Example:
//  * https://github.com/react-native-community/react-native-image-picker/blob/master/example/App.js
//  */
// export const PhotoPicker: React.FC = () => {
//   const handleSelectPhoto = () => {
//     const options = {
//       title: "Select Photo",
//       quality: 1.0,
//       maxWidth: 500,
//       maxHeight: 500,
//       storageOptions: {
//         skipBackup: true,
//       },
//     }

//     ImagePicker.showImagePicker(options, response => {
//       console.log("Response = ", response)

//       if (response.didCancel) {
//         console.log("User cancelled image picker")
//       } else if (response.error) {
//         console.log("ImagePicker Error: ", response.error)
//       } else if (response.customButton) {
//         console.log("User tapped custom button: ", response.customButton)
//       } else {
//         const source = { uri: response.uri }
//         console.log(source)

//         // You can also display the image using data:
//         // const source = { uri: 'data:image/jpeg;base64,' + response.data };
//       }
//     })
//   }

//   return (
//     <Button variant="noOutline" onPress={handleSelectPhoto}>
//       Photos (optional)
//     </Button>
//   )
// }
