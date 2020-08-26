import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Input } from "lib/Components/Input/Input"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { useArtworkForm } from "lib/Scenes/MyCollection/Screens/AddArtwork/Form/useArtworkForm"
import { AppStore } from "lib/store/AppStore"
import { Flex, Join, Spacer } from "palette"
import React from "react"

export const MyCollectionAddArtworkTitleAndYear = () => {
  const navActions = AppStore.actions.myCollection.navigation
  const { formik } = useArtworkForm()

  return (
    <>
      <FancyModalHeader onLeftButtonPress={() => navActions.goBack()}>Title & year</FancyModalHeader>
      <Flex mt={2}>
        <ScreenMargin>
          <Join separator={<Spacer my={1} />}>
            <Input
              title="Title"
              placeholder="Title"
              onChangeText={formik.handleChange("title")}
              onBlur={formik.handleBlur("title")}
              defaultValue={formik.values.title}
            />
            <Input
              title="Year"
              placeholder="Year"
              onChangeText={formik.handleChange("year")}
              onBlur={formik.handleBlur("year")}
              defaultValue={formik.values.year}
            />
          </Join>
        </ScreenMargin>
      </Flex>
    </>
  )
}
