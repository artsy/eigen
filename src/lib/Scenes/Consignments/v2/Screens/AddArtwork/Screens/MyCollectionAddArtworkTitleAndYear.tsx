import { Flex, Join, Spacer } from "@artsy/palette"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Input } from "lib/Components/Input/Input"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useArtworkForm } from "lib/Scenes/Consignments/v2/Screens/AddArtwork/Form/useArtworkForm"
import { AppStore } from "lib/store/AppStore"
import React from "react"

export const MyCollectionAddArtworkTitleAndYear = () => {
  const navActions = AppStore.actions.consignments.navigation
  const { formik } = useArtworkForm()

  return (
    <>
      <FancyModalHeader onBackPress={() => navActions.goBack()}>Title & year</FancyModalHeader>
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
