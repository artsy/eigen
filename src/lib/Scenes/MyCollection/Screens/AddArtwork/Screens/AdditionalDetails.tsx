import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Input } from "lib/Components/Input/Input"
import { Select } from "lib/Components/Select"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { useArtworkForm } from "lib/Scenes/MyCollection/Screens/AddArtwork/Form/useArtworkForm"
import { AppStore } from "lib/store/AppStore"
import { Box, Flex, Join, Sans, space, Spacer } from "palette"
import React, { useRef, useState } from "react"

export const AdditionalDetails = () => {
  const [isEdition, setIsEdition] = useState(false) // TODO: pass in edition props from db to compute initial state
  const pricePaidCurrencyInputRef = useRef<Select<string>>(null)
  const navActions = AppStore.actions.myCollection.navigation
  const { formik } = useArtworkForm()

  return (
    <Box>
      <FancyModalHeader onLeftButtonPress={() => navActions.goBackInModal()}>Additional Details</FancyModalHeader>
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
              onChangeText={formik.handleChange("costMinor")}
              onBlur={formik.handleBlur("costMinor")}
              defaultValue={String(formik.values.costMinor)}
            />

            <Select
              title="Currency"
              placeholder="Currency"
              options={pricePaidCurrencySelectOptions}
              value={formik.values.costCurrencyCode}
              enableSearch={false}
              showTitleLabel={false}
              ref={pricePaidCurrencyInputRef}
              onSelectValue={(value) => {
                formik.handleChange("costCurrencyCode")(value)
              }}
            />
          </Join>
        </ScreenMargin>
      </Flex>
    </Box>
  )
}

const pricePaidCurrencySelectOptions: Array<{
  label: string
  value: string
}> = [
  { label: "$ USD", value: "USD" },
  { label: "€ EUR", value: "EUR" },
  { label: "£ GBP", value: "GBP" },

  // Gravity supports the following, however for the prototype
  // we're only supporting the three above.

  // { label: "AED", value: "AED" },
  // { label: "ARS", value: "ARS" },
  // { label: "AUD", value: "AUD" },
  // { label: "BRL", value: "BRL" },
  // { label: "CAD", value: "CAD" },
  // { label: "CDF", value: "CDF" },
  // { label: "CHF", value: "CHF" },
  // { label: "CNY", value: "CNY" },
  // { label: "COP", value: "COP" },
  // { label: "DKK", value: "DKK" },
  // { label: "ERN", value: "ERN" },
  // { label: "ETB", value: "ETB" },
  // { label: "HKD", value: "HKD" },
  // { label: "IDR", value: "IDR" },
  // { label: "ILS", value: "ILS" },
  // { label: "INR", value: "INR" },
  // { label: "ISK", value: "ISK" },
  // { label: "JPY", value: "JPY" },
  // { label: "KRW", value: "KRW" },
  // { label: "MXN", value: "MXN" },
  // { label: "NOK", value: "NOK" },
  // { label: "NZD", value: "NZD" },
  // { label: "PHP", value: "PHP" },
  // { label: "RUB", value: "RUB" },
  // { label: "SEK", value: "SEK" },
  // { label: "SGD", value: "SGD" },
  // { label: "SZL", value: "SZL" },
  // { label: "TOP", value: "TOP" },
  // { label: "TRY", value: "TRY" },
  // { label: "TWD", value: "TWD" },
  // { label: "TZS", value: "TZS" },
  // { label: "VND", value: "VND" },
  // { label: "WST", value: "WST" },
  // { label: "ZAR", value: "ZAR" },
]
