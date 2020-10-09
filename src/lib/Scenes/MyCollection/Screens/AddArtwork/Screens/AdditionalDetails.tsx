import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Input } from "lib/Components/Input/Input"
import { Select } from "lib/Components/Select"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { useArtworkForm } from "lib/Scenes/MyCollection/Screens/AddArtwork/Form/useArtworkForm"
import { AppStore } from "lib/store/AppStore"
import { Flex, Join, Sans, space, Spacer } from "palette"
import React, { useRef, useState } from "react"
import { ScrollView } from "react-native"

export const AdditionalDetails = () => {
  const { formik } = useArtworkForm()
  const formikValues = formik?.values
  const hasEditionNumber: boolean = !!formikValues?.editionNumber!
  const [isEdition, setIsEdition] = useState(hasEditionNumber)
  const pricePaidCurrencyInputRef = useRef<Select<string>>(null)
  const navActions = AppStore.actions.myCollection.navigation

  return (
    <ScrollView>
      <FancyModalHeader onLeftButtonPress={() => navActions.goBackInModal()}>Additional Details</FancyModalHeader>
      <Flex mt={2}>
        <ScreenMargin>
          <Join separator={<Spacer my={1} />}>
            <Input
              title="Title"
              placeholder="Title"
              onChangeText={formik.handleChange("title")}
              onBlur={formik.handleBlur("title")}
              data-test-id="TitleInput"
              defaultValue={formikValues.title}
            />
            <Input
              title="Date"
              placeholder="Date"
              onChangeText={formik.handleChange("date")}
              onBlur={formik.handleBlur("date")}
              data-test-id="DateInput"
              defaultValue={formikValues.date}
            />

            <Checkbox
              onPress={() => setIsEdition(!isEdition)}
              data-test-id="EditionCheckbox"
              checked={hasEditionNumber}
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
                  defaultValue={formikValues.editionNumber!}
                  style={{ marginRight: space(1) }}
                  data-test-id="EditionNumberInput"
                />
                <Input
                  placeholder="Edition size"
                  onChangeText={formik.handleChange("editionSize")}
                  onBlur={formik.handleBlur("editionSize")}
                  data-test-id="EditionSizeInput"
                  defaultValue={formikValues.editionSize}
                />
              </Flex>
            )}

            <Input
              title="Materials"
              placeholder="Materials"
              onChangeText={formik.handleChange("category")}
              onBlur={formik.handleBlur("category")}
              data-test-id="MaterialsInput"
              defaultValue={formikValues.category}
            />

            <Input
              title="Price paid"
              placeholder="Price paid"
              onChangeText={formik.handleChange("costMinor")}
              onBlur={formik.handleBlur("costMinor")}
              data-test-id="PricePaidInput"
              defaultValue={formikValues.costMinor}
            />

            <Select
              title="Currency"
              placeholder="Currency"
              options={pricePaidCurrencySelectOptions}
              value={formikValues.costCurrencyCode}
              enableSearch={false}
              showTitleLabel={false}
              ref={pricePaidCurrencyInputRef}
              onSelectValue={(value) => {
                formik.handleChange("costCurrencyCode")(value)
              }}
              data-test-id="CurrencyInput"
            />
          </Join>
        </ScreenMargin>
      </Flex>
    </ScrollView>
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
