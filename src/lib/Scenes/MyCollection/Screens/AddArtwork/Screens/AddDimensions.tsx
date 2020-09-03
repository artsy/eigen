import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Input } from "lib/Components/Input/Input"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { useArtworkForm } from "lib/Scenes/MyCollection/Screens/AddArtwork/Form/useArtworkForm"
import { AppStore } from "lib/store/AppStore"
import { Flex, Join, Spacer } from "palette"
import React from "react"

export const AddDimensions = () => {
  const navActions = AppStore.actions.myCollection.navigation
  const { formik } = useArtworkForm()

  return (
    <>
      <FancyModalHeader onLeftButtonPress={() => navActions.goBack()}>Dimensions</FancyModalHeader>
      <Flex mt={2}>
        <ScreenMargin>
          <Join separator={<Spacer my={1} />}>
            <Input
              title="Height"
              placeholder="Height"
              onChangeText={formik.handleChange("height")}
              onBlur={formik.handleBlur("height")}
              defaultValue={formik.values.height}
            />
            <Input
              title="Width"
              placeholder="Width"
              onChangeText={formik.handleChange("width")}
              onBlur={formik.handleBlur("width")}
              defaultValue={formik.values.width}
            />
            <Input
              title="Depth"
              placeholder="Depth"
              onChangeText={formik.handleChange("depth")}
              onBlur={formik.handleBlur("depth")}
              defaultValue={formik.values.depth}
            />
          </Join>
        </ScreenMargin>
      </Flex>
    </>
  )
}
