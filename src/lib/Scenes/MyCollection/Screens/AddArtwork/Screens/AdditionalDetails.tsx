import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Input } from "lib/Components/Input/Input"
import { Select } from "lib/Components/Select"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { useArtworkForm } from "lib/Scenes/MyCollection/Screens/AddArtwork/Form/useArtworkForm"
import { AppStore } from "lib/store/AppStore"
import { Flex, Join, Sans, space, Spacer } from "palette"
import React, { useRef, useState } from "react"

export const AdditionalDetails = () => {
  const [isEdition, setIsEdition] = useState(false) // TODO: pass in edition props from db to compute initial state
  const pricePaidCurrencyInputRef = useRef<Select<Currency>>(null)
  const navActions = AppStore.actions.myCollection.navigation
  const { formik } = useArtworkForm()

  return (
    <>
      <FancyModalHeader onLeftButtonPress={() => navActions.goBack()}>Additional Details</FancyModalHeader>
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
              title="Date"
              placeholder="Date"
              onChangeText={formik.handleChange("date")}
              onBlur={formik.handleBlur("date")}
              defaultValue={formik.values.date}
            />

            <Checkbox
              onPress={() => setIsEdition(!isEdition)}
              // disabled={isLoading}
            >
              <Sans size="3" color="black60">
                This is an edition
              </Sans>
            </Checkbox>

            {!!isEdition && (
              <Flex flexDirection="row">
                <Input
                  placeholder="Edition number"
                  onChangeText={formik.handleChange("editionNumber")}
                  onBlur={formik.handleBlur("editionNumber")}
                  defaultValue={formik.values.editionNumber}
                  style={{ marginRight: space(1) }}
                />
                <Input
                  placeholder="Edition size"
                  onChangeText={formik.handleChange("editionSize")}
                  onBlur={formik.handleBlur("editionSize")}
                  defaultValue={formik.values.editionSize}
                />
              </Flex>
            )}

            <Input
              title="Materials"
              placeholder="Materials"
              onChangeText={formik.handleChange("category")}
              onBlur={formik.handleBlur("category")}
              defaultValue={formik.values.category}
            />

            <Input
              title="Price paid"
              placeholder="Price paid"
              onChangeText={formik.handleChange("pricePaid")}
              onBlur={formik.handleBlur("pricePaid")}
              defaultValue={formik.values.pricePaid}
            />

            <Select
              title="Currency"
              placeholder="Currency"
              options={pricePaidCurrencySelectOptions}
              value={formik.values.pricePaidCurrency}
              enableSearch={false}
              showTitleLabel={false}
              ref={pricePaidCurrencyInputRef}
              onSelectValue={(value) => {
                formik.handleChange("pricePaidCurrency")(value)
              }}
            />
          </Join>
        </ScreenMargin>
      </Flex>
    </>
  )
}

// TODO: Follow up with full currency option list
export type Currency = "USD" | "GDP" | "EUR" | ""

const pricePaidCurrencySelectOptions: Array<{
  label: string
  value: Currency
}> = [
  { label: "Dollars", value: "USD" },
  { label: "Pounds", value: "GDP" },
  { label: "Euros", value: "EUR" },
]
