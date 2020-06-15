import { Button, Flex, Join, Sans, Spacer } from "@artsy/palette"
import { FormikHandlers } from "formik"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useStoreActions, useStoreState } from "lib/Scenes/Consignments/v2/State/hooks"
import { Input } from "lib/Scenes/Search/Input"
import React from "react"

export const MyCollectionAddArtworkTitleAndYear = () => {
  const { pop } = useStoreActions(state => state.navigation)
  const { formik } = useStoreState(state => state.artwork)

  return (
    <Flex mt={4}>
      <Sans size="4" textAlign="center" weight="medium" style={{ position: "relative", top: -21 }}>
        Add title & year
      </Sans>

      <ScreenMargin>
        <Join separator={<Spacer my={1} />}>
          <Input
            title="Title"
            placeholder="Title"
            onChangeText={formik?.handleChange("title") as FormikHandlers["handleChange"]}
            onBlur={formik?.handleBlur("title") as FormikHandlers["handleBlur"]}
            value={formik?.values.title}
          />
          <Input
            title="Year"
            placeholder="Year"
            onChangeText={formik?.handleChange("year") as any}
            onBlur={formik?.handleBlur("year") as any}
            value={formik?.values.year}
          />
        </Join>

        <Spacer my={1} />

        <Button block onPress={() => pop()}>
          Done
        </Button>
      </ScreenMargin>
    </Flex>
  )
}
