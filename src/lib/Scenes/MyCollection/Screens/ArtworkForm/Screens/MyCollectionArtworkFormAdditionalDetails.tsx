import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader as NavHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Flex, Input, Join, Sans, Spacer } from "palette"
import { Checkbox } from "palette/elements/Checkbox"
import { Select } from "palette/elements/Select"
import React, { useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { useArtworkForm } from "../Form/useArtworkForm"
import { ArtworkFormScreen } from "../MyCollectionArtworkForm"

export const MyCollectionAdditionalDetailsForm: React.FC<StackScreenProps<ArtworkFormScreen, "AdditionalDetails">> = ({
  route,
}) => {
  const { formik } = useArtworkForm()
  const formikValues = formik?.values
  const [isEdition, setIsEdition] = useState(formikValues?.isEdition)

  const handleEditionChange = (editionStatus: boolean) => {
    setIsEdition(editionStatus)
    formik.setFieldValue("isEdition", editionStatus)
  }

  return (
    <Flex style={{ flex: 1 }}>
      <NavHeader onLeftButtonPress={() => route.params.onHeaderBackButtonPress()}>Additional Details</NavHeader>
      <ScrollView style={{ flex: 1 }}>
        <Flex p={2}>
          <Join separator={<Spacer my={1} />}>
            <Input
              title="TITLE"
              placeholder="Title"
              onChangeText={formik.handleChange("title")}
              onBlur={formik.handleBlur("title")}
              testID="TitleInput"
              defaultValue={formikValues.title}
              shouldAddListenerForClear={false}
            />
            <Input
              title="YEAR CREATED"
              keyboardType="number-pad"
              placeholder="Year created"
              onChangeText={formik.handleChange("date")}
              onBlur={formik.handleBlur("date")}
              testID="DateInput"
              defaultValue={formikValues.date}
              shouldAddListenerForClear={false}
            />

            <Checkbox
              onPress={() => handleEditionChange(!isEdition)}
              testID="EditionCheckbox"
              checked={isEdition}
              // disabled={isLoading}
            >
              <Sans size="3" color="black60">
                This is an edition
              </Sans>
            </Checkbox>

            <Flex flexDirection="row" display={isEdition ? "flex" : "none"}>
              <Join separator={<Spacer mx={0.5} />}>
                <Input
                  placeholder="Edition number"
                  keyboardType="number-pad"
                  onChangeText={formik.handleChange("editionNumber")}
                  onBlur={formik.handleBlur("editionNumber")}
                  defaultValue={formikValues.editionNumber!}
                  testID="EditionNumberInput"
                  shouldAddListenerForClear={false}
                />
                <Input
                  placeholder="Edition size"
                  keyboardType="number-pad"
                  onChangeText={formik.handleChange("editionSize")}
                  onBlur={formik.handleBlur("editionSize")}
                  testID="EditionSizeInput"
                  defaultValue={formikValues.editionSize}
                  shouldAddListenerForClear={false}
                />
              </Join>
            </Flex>

            <Input
              title="MATERIALS"
              placeholder="Materials"
              onChangeText={formik.handleChange("category")}
              onBlur={formik.handleBlur("category")}
              testID="MaterialsInput"
              defaultValue={formikValues.category}
              shouldAddListenerForClear={false}
            />

            <Input
              multiline
              title="PROVENANCE"
              placeholder="Provenance"
              value={formikValues.provenance}
              onChangeText={formik.handleChange("provenance")}
              testID="ProvenanceInput"
              shouldAddListenerForClear={false}
            />

            <Input
              title="PRICE PAID"
              placeholder="Price paid"
              keyboardType="decimal-pad"
              onChangeText={formik.handleChange("pricePaidDollars")}
              onBlur={formik.handleBlur("pricePaidDollars")}
              testID="PricePaidInput"
              defaultValue={formikValues.pricePaidDollars}
              shouldAddListenerForClear={false}
            />

            <Select
              title="Currency"
              placeholder="Currency"
              options={pricePaidCurrencySelectOptions}
              value={formikValues.pricePaidCurrency}
              enableSearch={false}
              showTitleLabel={false}
              onSelectValue={(value) => {
                formik.handleChange("pricePaidCurrency")(value)
              }}
              testID="CurrencyInput"
            />
          </Join>
        </Flex>
      </ScrollView>
    </Flex>
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
