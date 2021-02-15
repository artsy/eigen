import { NavigationProp } from "@react-navigation/native"
import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Input } from "lib/Components/Input/Input"
import { Select } from "lib/Components/Select"
import { TextArea } from "lib/Components/TextArea"
import { Flex, Join, Sans, space, Spacer } from "palette"
import React, { useRef, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { useArtworkForm } from "../Form/useArtworkForm"
import { ArtworkFormModalScreen } from "../MyCollectionArtworkFormModal"

export const MyCollectionAdditionalDetailsForm: React.FC<{ navigation: NavigationProp<ArtworkFormModalScreen> }> = ({
  navigation,
}) => {
  const { formik } = useArtworkForm()
  const formikValues = formik?.values
  const [isEdition, setIsEdition] = useState(formikValues?.isEdition)
  const pricePaidCurrencyInputRef = useRef<Select<string>>(null)

  const handleEditionChange = (editionStatus: boolean) => {
    setIsEdition(editionStatus)
    formik.setFieldValue("isEdition", editionStatus)
  }

  return (
    <Flex style={{ flex: 1 }}>
      <FancyModalHeader onLeftButtonPress={() => navigation.goBack()}>Additional Details</FancyModalHeader>
      <ScrollView style={{ flex: 1 }}>
        <Flex p="2">
          <Join separator={<Spacer my="1" />}>
            <Input
              title="Title"
              placeholder="Title"
              onChangeText={formik.handleChange("title")}
              onBlur={formik.handleBlur("title")}
              data-test-id="TitleInput"
              defaultValue={formikValues.title}
            />
            <Input
              title="Year created"
              keyboardType="number-pad"
              placeholder="Year created"
              onChangeText={formik.handleChange("date")}
              onBlur={formik.handleBlur("date")}
              data-test-id="DateInput"
              defaultValue={formikValues.date}
            />

            <Checkbox
              onPress={() => handleEditionChange(!isEdition)}
              data-test-id="EditionCheckbox"
              checked={isEdition}
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
                  keyboardType="number-pad"
                  onChangeText={formik.handleChange("editionNumber")}
                  onBlur={formik.handleBlur("editionNumber")}
                  defaultValue={formikValues.editionNumber!}
                  style={{ marginRight: space(1) }}
                  data-test-id="EditionNumberInput"
                />
                <Input
                  placeholder="Edition size"
                  keyboardType="number-pad"
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

            <TextArea
              placeholder="Provenance"
              title="Provenance"
              value={formikValues.provenance}
              onChangeText={formik.handleChange("provenance")}
              data-test-id="ProvenanceInput"
            />

            <Input
              title="Price paid"
              placeholder="Price paid"
              keyboardType="decimal-pad"
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
