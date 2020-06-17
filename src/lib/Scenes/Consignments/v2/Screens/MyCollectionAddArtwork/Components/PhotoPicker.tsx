import { Button } from "@artsy/palette"
import React from "react"
import ImagePicker from "react-native-image-picker"

/**
 * @see https://github.com/react-native-community/react-native-image-picker
 *
 * Example:
 * https://github.com/react-native-community/react-native-image-picker/blob/master/example/App.js
 */
export const PhotoPicker: React.FC = () => {
  const handleSelectPhoto = () => {
    const options = {
      title: "Select Photo",
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    }

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response)

      if (response.didCancel) {
        console.log("User cancelled image picker")
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error)
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton)
      } else {
        const source = { uri: response.uri }
        console.log(source)

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      }
    })
  }

  return (
    <Button variant="noOutline" onPress={handleSelectPhoto}>
      Photos (optional)
    </Button>
  )
}
