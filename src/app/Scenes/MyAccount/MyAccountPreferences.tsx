import { captureException } from "@sentry/react-native"
import {
  LengthUnitPreference,
  MyAccountPreferencesQuery,
} from "__generated__/MyAccountPreferencesQuery.graphql"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { SectionTitle } from "app/Components/SectionTitle"
import { GlobalStore } from "app/store/GlobalStore"
import { CURRENCIES } from "app/utils/currencies"
import { withSuspense } from "app/utils/withSuspense"
import { Flex, RadioButton, Select, Text, Touchable } from "palette"
import React, { useState } from "react"
import { Alert } from "react-native"
import { useLazyLoadQuery } from "react-relay"
import { graphql } from "relay-runtime"
import { Separator } from "../../../palette/elements/Separator/Separator"
import { Currency, Metric } from "../Search/UserPrefsModel"
import { updateMyUserProfile } from "./updateMyUserProfile"

export const MyAccountPreferencesQueryRenderer = withSuspense(() => {
  const data = useLazyLoadQuery<MyAccountPreferencesQuery>(MyAccountPreferencesScreenQuery, {}, {})

  const [currency, setCurrency] = useState(data.me?.currencyPreference as Currency)
  const [metric, setMetric] = useState(data.me?.lengthUnitPreference as LengthUnitPreference)

  const handleMetricChange = async (value: LengthUnitPreference) => {
    const oldValue = currency
    try {
      setMetric(value)
      // Typescript wasn't able to tell that the type for "CM" | "IN"
      // in lowercase is "cm" | "in" and was returning "string" instead
      GlobalStore.actions.userPrefs.setMetric(value.toLowerCase() as Metric)
      updateMyUserProfile({
        lengthUnitPreference: value,
      })
    } catch (error) {
      captureException(error)
      setCurrency(oldValue)
      Alert.alert("Failed to update metric")
    }
  }

  const handleCurrencyChange = async (value: Currency) => {
    const oldValue = currency
    try {
      setCurrency(value)
      GlobalStore.actions.userPrefs.setCurrency(value)
      updateMyUserProfile({
        currencyPreference: value,
      })
    } catch (error) {
      captureException(error)
      setCurrency(oldValue)
      Alert.alert("Failed to update currency")
    }
  }

  return (
    <PageWithSimpleHeader title="Preferences">
      <Flex px={2} pt={2}>
        <SectionTitle title="Currency" />
        <Select
          title="Currency"
          placeholder="Currency"
          options={CURRENCIES}
          value={currency}
          enableSearch={false}
          showTitleLabel={false}
          onSelectValue={(value) => {
            handleCurrencyChange(value as Currency)
          }}
          testID="CurrencyPicker"
        />

        <Separator my={4} />

        <SectionTitle title="Length Unit" />
        <Flex flexDirection="row">
          <Touchable
            haptic
            onPress={() => handleMetricChange("CM")}
            hitSlop={{ top: 10, left: 30, right: 10, bottom: 10 }}
          >
            <Flex flexDirection="row">
              <RadioButton selected={metric === "CM"} />
              <Text marginRight="3">cm</Text>
            </Flex>
          </Touchable>
          <Touchable
            haptic
            onPress={() => handleMetricChange("IN")}
            hitSlop={{ top: 10, left: 30, right: 10, bottom: 10 }}
          >
            <Flex flexDirection="row">
              <RadioButton selected={metric === "IN"} />
              <Text>in</Text>
            </Flex>
          </Touchable>
        </Flex>
      </Flex>
    </PageWithSimpleHeader>
  )
})

const MyAccountPreferencesScreenQuery = graphql`
  query MyAccountPreferencesQuery {
    me {
      lengthUnitPreference
      currencyPreference
    }
  }
`
