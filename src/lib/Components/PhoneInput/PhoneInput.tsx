import { TriangleDown } from "lib/Icons/TriangleDown"
import { color, Flex, Sans, Spacer, Touchable } from "palette"
import { useState } from "react"
import React from "react"
import { View } from "react-native"
import { flagMappings } from "react-native-country-flags"
import { Input, InputProps } from "../Input/Input"
import { Select, SelectOption } from "../Select"
import countries from "./countries.json"
import { getCountryIso2FromPhoneNumber } from "./getCountryIso2FromPhoneNumber"

const iso2dialCode = {} as Record<string, string>
const countryOptions: Array<SelectOption<string>> = countries.map((c) => {
  iso2dialCode[c.iso2] = c.dialCode
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
  const Flag = flagMappings[iso2Code]
  if (!Flag) {
    return <View style={{ width: 24, height: 24, backgroundColor: color("black5") }}></View>
  }
  return <Flag width={20} height={12}></Flag>
}

export const PhoneInput: React.FC<
  {
    onChange: (fullValue: string, parts: { countryCode: string; phoneNumber: string }) => void
    defaultCountryIso2: string
  } & Omit<InputProps, "onChange">
> = ({ value, onChange, defaultCountryIso2, ...rest }) => {
  const [countryIso, setCountryIso] = useState(
    (value && getCountryIso2FromPhoneNumber(value)) ?? defaultCountryIso2 ?? "gb"
  )

  const countryCode = iso2dialCode[countryIso]

  return (
    <Input
      {...rest}
      keyboardType="phone-pad"
      renderLeftHandSection={() => (
        <Select<string>
          options={countryOptions}
          enableSearch
          value={countryIso}
          onSelectValue={setCountryIso}
          title="Country code"
          // tslint:disable-next-line:no-shadowed-variable
          renderItemLabel={({ label, value }) => {
            return (
              <Flex flexDirection="row" alignItems="center" flexShrink={1}>
                <Sans size="4" style={{ width: 45 }}>
                  +{iso2dialCode[value]}
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
                      +{countryCode}
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
}
