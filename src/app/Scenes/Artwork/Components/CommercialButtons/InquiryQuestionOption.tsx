import {
  Box,
  Checkbox,
  ChevronIcon,
  Flex,
  Join,
  Separator,
  Spacer,
  Text,
  useTheme,
} from "@artsy/palette-mobile"
import { useArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { InquiryQuestionIDs } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import React, { useLayoutEffect } from "react"
import { LayoutAnimation, TouchableOpacity } from "react-native"

interface InquiryQuestionOptionProps {
  id: string
  question: string
  setShippingModalVisibility?: (isVisible: boolean) => void
}

export const InquiryQuestionOption: React.FC<InquiryQuestionOptionProps> = ({
  id,
  question,
  setShippingModalVisibility,
}) => {
  const { color, space } = useTheme()
  const { state, dispatch } = useArtworkInquiryContext()
  const isShipping = id === InquiryQuestionIDs.Shipping

  const questionSelected = Boolean(
    state.inquiryQuestions.find((iq) => {
      return iq.questionID === id
    })
  )

  useLayoutEffect(() => {
    if (isShipping) {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.linear,
        duration: 200,
      })
    }
  }, [questionSelected])

  const setSelection = () => {
    dispatch({
      type: "selectInquiryQuestion",
      payload: {
        questionID: id,
        details: isShipping ? state.shippingLocation?.name : null,
        isChecked: !questionSelected,
      },
    })
  }

  return (
    <>
      <TouchableOpacity onPress={setSelection}>
        <Flex
          style={{
            borderColor: questionSelected ? color("mono100") : color("mono10"),
            borderWidth: 1,
            borderRadius: 5,
            flexDirection: "column",
            marginTop: space(1),
            padding: space(2),
          }}
        >
          <Flex flexDirection="row" justifyContent="space-between">
            <Flex flexDirection="row">
              <Join separator={<Spacer x={4} />}>
                <Checkbox
                  testID={`checkbox-${id}`}
                  checked={questionSelected}
                  onPress={setSelection}
                />
                <Text variant="sm">{question}</Text>
              </Join>
            </Flex>
          </Flex>

          {!!isShipping && !!questionSelected && (
            <>
              <Separator my={2} />

              <TouchableOpacity
                testID="toggle-shipping-modal"
                onPress={() => {
                  if (typeof setShippingModalVisibility === "function") {
                    setShippingModalVisibility(true)
                  }
                }}
              >
                <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                  {!state.shippingLocation ? (
                    <>
                      <Text variant="sm" color="mono60">
                        Add your location
                      </Text>
                      <Box>
                        <ChevronIcon color="mono60" />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Text variant="sm" color="mono100" style={{ width: "70%" }}>
                        {state.shippingLocation.name}
                      </Text>
                      <Text variant="sm" color="blue100">
                        Edit
                      </Text>
                    </>
                  )}
                </Flex>
              </TouchableOpacity>
            </>
          )}
        </Flex>
      </TouchableOpacity>
    </>
  )
}
