import { TriangleDown } from "lib/Icons/TriangleDown"
import { color, Flex, Sans, Spacer, Touchable } from "palette"
import { useEffect, useRef, useState } from "react"
import React from "react"
import { Input, InputProps } from "../Input/Input"
import { Select, SelectOption } from "../Select"
import { cleanUserPhoneNumber } from "./cleanUserPhoneNumber"
import { countries, countryIndex } from "./countries"
import { formatPhoneNumber } from "./formatPhoneNumber"

export const PhoneInput = React.forwardRef<
  Input,
  {
    onChange?: (value: string) => void
    maxModalHeight?: number
  } & Omit<InputProps, "onChange">
>(({ value, onChange, onChangeText, maxModalHeight, ...rest }, outerRef) => {
  const innerRef = useRef<Input | null>()
  const initialValues = cleanUserPhoneNumber(value ?? "")

  const [countryCode, setCountryCode] = useState(initialValues.countryCode)
  const [phoneNumber, setPhoneNumber] = useState(
    formatPhoneNumber({ current: initialValues.phoneNumber, previous: initialValues.phoneNumber, countryCode })
  )

  const dialCode = countryIndex[countryCode].dialCode

  const isFirstRun = useRef(true)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    const newValue = phoneNumber ? `+${dialCode} ${phoneNumber}` : ""
    onChangeText?.(newValue)
    onChange?.(newValue)
  }, [phoneNumber, dialCode])

  return (
    <Input
      {...rest}
      ref={(ref) => {
        if (typeof outerRef === "function") {
          outerRef(ref)
        } else if (outerRef && "current" in outerRef) {
          // @ts-expect-error
          outerRef.current = ref
        } else if (outerRef != null) {
          console.error("bad ref given to PhoneInput")
        }
        innerRef.current = ref
      }}
      value={phoneNumber}
      placeholder={countryIndex[countryCode]?.mask?.replace(/9/g, "0")}
      placeholderTextColor={color("black30")}
      onChangeText={(newPhoneNumber) =>
        setPhoneNumber(formatPhoneNumber({ current: newPhoneNumber, previous: phoneNumber, countryCode }))
      }
      keyboardType="phone-pad"
      renderLeftHandSection={() => (
        <Select<string>
          options={countryOptions}
          enableSearch
          value={countryCode}
          maxModalHeight={maxModalHeight}
          onModalFinishedClosing={() => {
            innerRef.current?.focus()
          }}
          onSelectValue={(newCountryCode) => {
            setCountryCode(newCountryCode)
            setPhoneNumber(
              formatPhoneNumber({ current: phoneNumber, previous: phoneNumber, countryCode: newCountryCode })
            )
          }}
          title="Country code"
          renderButton={({ selectedValue, onPress }) => {
            return (
              <Touchable onPress={onPress}>
                <Flex flexDirection="row" style={{ width: "100%", height: "100%" }}>
                  <Flex flexDirection="row" px="1" alignItems="center" backgroundColor="black10">
                    {/* selectedValue should always be present */}
                    <Sans size="4">{countryIndex[selectedValue ?? countryCode].flag}</Sans>
                    <Spacer mr="0.5" />
                    <TriangleDown width="8" />
                  </Flex>
                  <Flex justifyContent="center" pl="1">
                    <Sans color="black60" size="3" mt="2">
                      +{dialCode}
                    </Sans>
                  </Flex>
                </Flex>
              </Touchable>
            )
          }}
          // tslint:disable-next-line:no-shadowed-variable
          renderItemLabel={({ label, value }) => {
            return (
              <Flex flexDirection="row" alignItems="center" flexShrink={1}>
                <Sans size="4">{countryIndex[value].flag}</Sans>
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
        />
      )}
    />
  )
})

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
