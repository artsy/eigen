import { ThemeV3 } from "@artsy/palette-tokens"
import {
  Flex,
  InputProps,
  InputRef,
  Spacer,
  Text,
  Touchable,
  TriangleDown,
  useColor,
} from "palette"
import {
  INTERNALSelectAndInputCombinationBase,
  ValuePayload,
} from "palette/elements/Input/INTERNALSelectAndInputCombinationBase"
import { computeBorderColor } from "palette/elements/Input/Input"
import { SelectOption } from "palette/elements/Select"
import { forwardRef, useEffect, useRef, useState } from "react"

export const MoneyInput = forwardRef<
  InputRef,
  {
    currencyTextVariant?: keyof ThemeV3["textVariants"]
    initialValues?: { currency?: SupportedCurrencies; amount?: string }
    maxModalHeight?: number
    onChange?: (value: { currency?: string; amount?: string }) => void
    onModalFinishedClosing?: () => void
    shouldDisplayLocalError?: boolean
  } & Omit<InputProps, "onChange" | "onChangeText">
>(
  (
    {
      currencyTextVariant,
      onChange,
      onModalFinishedClosing,
      maxModalHeight,
      shouldDisplayLocalError = true,
      initialValues,
      ...rest
    },
    ref
  ) => {
    const color = useColor()
    const [currency, setCurrency] = useState<SupportedCurrencies>(
      initialValues?.currency ?? currencyOptions[0].value
    )
    const [amount, setAmount] = useState<string | undefined>(initialValues?.amount ?? undefined)
    const [validationErrorMessage, setValidationErrorMessage] = useState("")

    const handleValidation = () => {
      if (!amount) {
        setValidationErrorMessage("")
        return
      }
      const isValid = Number(amount) > -0.0000000001
      if (shouldDisplayLocalError) {
        setValidationErrorMessage(isValid ? "" : "Please enter a valid amount.")
      }
    }

    const onValueChange = (selectAndInputValue: ValuePayload) => {
      const {
        select: { value: currencyValue },
        input: { value: amountValue },
      } = selectAndInputValue
      setCurrency(currencyValue)
      setAmount(amountValue)
    }

    const isFirstRun = useRef(true)
    useEffect(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false
        return
      }
      onChange?.({ currency, amount })
    }, [amount, currency])

    const error =
      shouldDisplayLocalError && validationErrorMessage ? validationErrorMessage : rest.error

    return (
      <INTERNALSelectAndInputCombinationBase
        // Props for Input
        {...rest}
        ref={ref}
        value={amount}
        keyboardType="numeric"
        onValueChange={onValueChange}
        validate={handleValidation}
        //
        //
        // Props For Select
        optionsForSelect={currencyOptions}
        enableSearchForSelect={false}
        valueForSelect={currency}
        maxModalHeightForSelect={maxModalHeight}
        onModalFinishedClosingForSelect={onModalFinishedClosing}
        onSelectValueForSelect={(selectedCurrency) => {
          setCurrency(selectedCurrency as SupportedCurrencies)
        }}
        titleForSelect="Currency"
        renderButtonForSelect={({ selectedValue, onPress }) => {
          return (
            <Touchable onPress={onPress}>
              <Flex
                flex={1}
                flexDirection="row"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRightColor: color(computeBorderColor({ error: !!error })),
                  borderRightWidth: 1,
                }}
              >
                <Flex flexDirection="row" px="1" alignItems="center">
                  {/* selectedValue should always be present */}
                  <Text variant={currencyTextVariant ?? "sm-display"}>
                    {currencyOptions.find((c) => c.value === selectedValue)?.label ??
                      currencyOptions[0].label}
                  </Text>
                  <Spacer mr={0.5} />
                  <TriangleDown width="8" />
                </Flex>
              </Flex>
            </Touchable>
          )
        }}
        renderItemLabelForSelect={({ label, value }) => {
          return (
            <Flex flexDirection="row" alignItems="center" flexShrink={1}>
              <Text
                variant="sm-display"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ flexShrink: 1 }}
                underline={value === currency}
                color={value === currency ? color("blue100") : undefined}
              >
                {label}
              </Text>
            </Flex>
          )
        }}
        error={error}
      />
    )
  }
)

type SupportedCurrencies = "USD" | "EUR" | "GBP"
const currencyOptions: Array<SelectOption<SupportedCurrencies>> = [
  { label: "USD $", value: "USD" },
  { label: "EUR €", value: "EUR" },
  { label: "GBP £", value: "GBP" },
]
