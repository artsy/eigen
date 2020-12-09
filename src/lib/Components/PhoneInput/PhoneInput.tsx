import { TriangleDown } from "lib/Icons/TriangleDown"
import { color, Flex, Sans, Spacer, Touchable } from "palette"
import { useEffect, useState } from "react"
import React from "react"
import { Image, View } from "react-native"
import { getCountry } from "react-native-localize"
import { Input, InputProps } from "../Input/Input"
import { Select, SelectOption } from "../Select"
import { countries, countryIndex } from "./countries"
import { getCountryIso2FromPhoneNumber } from "./getCountryIso2FromPhoneNumber"

const countryOptions: Array<SelectOption<string>> = countries.map((c) => {
  return {
    label: c.name,
    value: c.iso2,
    searchImportance: c.priority,
    searchTerms: [
      c.dialCode,
      "+" + c.dialCode,
      c.name,
      // individual words of country name
      ...c.name.split(/\W+/g),
      // initials of country name
      c.name
        .split(/\W+/g)
        .map((word) => word[0])
        .join(""),
    ],
  }
})

const CountryFlag: React.FC<{ iso2Code: string }> = ({ iso2Code }) => {
  const imageSrc = countryIndex[iso2Code]?.flag
  if (!imageSrc) {
    return <View style={{ width: 20, height: 12, backgroundColor: color("black5") }}></View>
  }
  return <Image width={20} height={12} source={imageSrc}></Image>
}

function cleanUserPhoneNumber(value: string) {
  // try to parse out the country code from the phone number
  if (value.startsWith("00")) {
    value = "+" + value.slice(2)
  }
  // fall back to user's current locale
  const countryCode = getCountryIso2FromPhoneNumber(value) ?? getCountry().toLowerCase()
  const dialCode = countryIndex[countryCode].dialCode
  const phoneNumber = value.startsWith("+" + dialCode) ? value.slice(dialCode.length + 1) : value
  return { countryCode, phoneNumber }
}

export const PhoneInput = React.forwardRef<
  Input,
  {
    onChange?: (value: string) => void
  } & Omit<InputProps, "onChange">
>(({ value, onChange, onChangeText, ...rest }, ref) => {
  const initialValues = cleanUserPhoneNumber(value ?? "")

  const [countryCode, setCountryCode] = useState(initialValues.countryCode)
  const [phoneNumber, setPhoneNumber] = useState(initialValues.phoneNumber)

  const dialCode = countryIndex[countryCode].dialCode

  useEffect(() => {
    const newValue = `+${dialCode} ${phoneNumber}`
    onChangeText?.(newValue)
    onChange?.(newValue)
  }, [phoneNumber, dialCode])

  return (
    <Input
      ref={ref}
      {...rest}
      value={phoneNumber}
      onChangeText={setPhoneNumber}
      keyboardType="phone-pad"
      renderLeftHandSection={() => (
        <Select<string>
          options={countryOptions}
          enableSearch
          value={countryCode}
          onSelectValue={setCountryCode}
          title="Country code"
          // tslint:disable-next-line:no-shadowed-variable
          renderItemLabel={({ label, value }) => {
            return (
              <Flex flexDirection="row" alignItems="center" flexShrink={1}>
                <CountryFlag iso2Code={value} />
                <Spacer mr="1" />
                <Sans size="4" style={{ width: 45 }}>
                  +{countryIndex[value].dialCode}
                </Sans>
                <Spacer mr="1" />
                <Sans size="4" numberOfLines={1} ellipsizeMode="tail" style={{ flexShrink: 1 }}>
                  {label}
                </Sans>
              </Flex>
            )
          }}
          renderButton={({ selectedValue, onPress }) => {
            return (
              <Touchable onPress={onPress}>
                <Flex flexDirection="row" style={{ width: "100%", height: "100%" }}>
                  <Flex flexDirection="row" px="1" alignItems="center" backgroundColor="black10">
                    <CountryFlag iso2Code={selectedValue ?? "us"} />
                    <Spacer mr={0.5} />
                    <TriangleDown width="8" />
                  </Flex>
                  <Flex justifyContent="center" pl="1">
                    <Sans color="black30" size="3" mt="2px">
                      +{dialCode}
                    </Sans>
                  </Flex>
                </Flex>
              </Touchable>
            )
          }}
        />
      )}
    />
  )
})
