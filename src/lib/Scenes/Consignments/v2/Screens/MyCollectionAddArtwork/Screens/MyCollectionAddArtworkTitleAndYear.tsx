import { Button, Flex, Join, Sans, Spacer } from "@artsy/palette"
import { useFormikContext } from "formik"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useFormikSync } from "lib/Scenes/Consignments/v2/Form/useFormikSync"
import { ArtworkFormValues } from "lib/Scenes/Consignments/v2/State/artworkModel"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import { Input } from "lib/Scenes/Search/Input"
import React from "react"

export const MyCollectionAddArtworkTitleAndYear = () => {
  const navigationActions = useStoreActions(actions => actions.navigation)
  const formik = useFormikContext<ArtworkFormValues>()

  useFormikSync()

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

        <Spacer my={1} />

        <Button block onPress={navigationActions.goBack}>
          Done
        </Button>
      </ScreenMargin>
    </Flex>
  )
}
