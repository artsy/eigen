import * as glibphone from "google-libphonenumber"
import { TriangleDown } from "lib/Icons/TriangleDown"
import replace from "lodash/replace"
import { Flex, Input, InputProps, Sans, Spacer, Text, Touchable, useColor } from "palette"
import { useEffect, useRef, useState } from "react"
import React from "react"
import { Platform } from "react-native"
import { Select, SelectOption } from "../../../palette/elements/Select"
import { cleanUserPhoneNumber } from "./cleanUserPhoneNumber"
import { countries, countryIndex } from "./countries"
import { formatPhoneNumber } from "./formatPhoneNumber"

/** Underline bar height for text input on android when focused */
const UNDERLINE_TEXTINPUT_HEIGHT_ANDROID = 1.5

export const PhoneInput = React.forwardRef<
  Input,
  {
    setValidation: (value: boolean) => void
    onChange?: (value: string) => void
    maxModalHeight?: number
  } & Omit<InputProps, "onChange">
>(({ setValidation, value, onChange, onChangeText, maxModalHeight, ...rest }, outerRef) => {
  const color = useColor()
  const innerRef = useRef<Input | null>()
  const initialValues = cleanUserPhoneNumber(value ?? "")
  const [countryCode, setCountryCode] = useState<string>(initialValues.countryCode)
  const [phoneNumber, setPhoneNumber] = useState(
    formatPhoneNumber({
      current: initialValues.phoneNumber,
      previous: initialValues.phoneNumber,
      countryCode,
    })
  )
  const [validationMessage, setValidationMessage] = useState<string | undefined>(undefined)
  const dialCode = countryIndex[countryCode].dialCode
  const countryISO2Code = countryIndex[countryCode].iso2
  const phoneUtil = glibphone.PhoneNumberUtil.getInstance()

  useEffect(() => {
    if (isFirstRun.current) {
      return
    }

    const cleanPhoneNumber = cleanUserPhoneNumber(value ?? "")
    const formattedPhoneNumber = formatPhoneNumber({
      current: cleanPhoneNumber.phoneNumber,
      previous: initialValues.phoneNumber,
      countryCode: cleanPhoneNumber.countryCode,
    })

    setPhoneNumber(formattedPhoneNumber.replace(/[\D]$/, ""))
    setCountryCode(cleanPhoneNumber.countryCode)
  }, [value])

  const isValidNumber = (number: string, code: string) => {
    try {
      number = replace(number, /[+()-\s]/g, "")
      const parsedNumber = phoneUtil.parse(number, code)
      return phoneUtil.isValidNumber(parsedNumber)
    } catch (err) {
      return false
    }
  }

  const handleValidation = () => {
    const isValid = isValidNumber(phoneNumber, countryISO2Code)
    setValidation(isValid)
    setValidationMessage(isValid ? "" : "This phone number is incomplete")
  }

  const isFirstRun = useRef(true)
  useEffect(() => {
    if (isFirstRun.current) {
      if (phoneNumber.length > 0) {
        handleValidation()
      }
      isFirstRun.current = false
      return
    }

    handleValidation()

    const newValue = phoneNumber ? `+${dialCode} ${phoneNumber}` : ""

    onChangeText?.(newValue)
    onChange?.(newValue)
  }, [phoneNumber, dialCode])

  return (
    <Flex style={{ height: 90 }}>
      <Input
        style={{ height: 70 }}
        {...rest}
        ref={(ref) => {
          if (typeof outerRef === "function") {
            outerRef(ref)
          } else if (outerRef && "current" in outerRef) {
            outerRef.current = ref
          } else if (outerRef != null) {
            console.error("bad ref given to PhoneInput")
          }
          innerRef.current = ref
        }}
        value={phoneNumber}
        inputTextStyle={Platform.select({
          android: { paddingTop: UNDERLINE_TEXTINPUT_HEIGHT_ANDROID },
          default: {},
        })}
        placeholder={countryIndex[countryCode]?.mask?.replace(/9/g, "0")}
        placeholderTextColor={color("black30")}
        onChangeText={(newPhoneNumber) =>
          setPhoneNumber(
            formatPhoneNumber({ current: newPhoneNumber, previous: phoneNumber, countryCode })
          )
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
                formatPhoneNumber({
                  current: phoneNumber,
                  previous: phoneNumber,
                  countryCode: newCountryCode,
                })
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
                      <Spacer mr={0.5} />
                      <TriangleDown width="8" />
                    </Flex>
                    <Flex justifyContent="center" pl="1">
                      <Sans color="black60" size="3">
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
      <Text numberOfLines={1} variant="xs" color="red" style={{ height: 20 }}>
        {validationMessage}
      </Text>
    </Flex>
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
