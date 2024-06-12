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
import {
  ArtworkInquiryActions,
  ArtworkInquiryContextState,
  InquiryQuestionIDs,
} from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import React from "react"
import { TouchableOpacity } from "react-native"

export const InquiryQuestion: React.FC<{
  id: string
  question: string
  state: ArtworkInquiryContextState
  dispatch: React.Dispatch<ArtworkInquiryActions>
}> = ({ id, question, state, dispatch }) => {
  const { color, space } = useTheme()

  const isShippingQuestion = id === InquiryQuestionIDs.Shipping

  const questionSelected = Boolean(
    state.inquiryQuestions.find((iq) => {
      return iq.questionID === id
    })
  )

  const handleQuestionPress = () => {
    dispatch({
      type: "selectInquiryQuestion",
      payload: {
        questionID: id,
        details: isShippingQuestion ? state.shippingLocation?.name : null,
        isChecked: !questionSelected,
      },
    })
  }

  const handleShippingLocationPress = () => {
    dispatch({ type: "closeInquiryDialog" })
    dispatch({ type: "openShippingQuestionDialog" })
  }

  return (
    <>
      <TouchableOpacity onPress={handleQuestionPress}>
        <Flex
          style={{
            borderColor: questionSelected ? color("black100") : color("black10"),
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
                  onPress={handleQuestionPress}
                />
                <Text variant="sm">{question}</Text>
              </Join>
            </Flex>
          </Flex>

          {!!isShippingQuestion && !!questionSelected && (
            <>
              <Separator my={2} />

              <TouchableOpacity
                testID="toggle-shipping-modal"
                onPress={handleShippingLocationPress}
              >
                <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                  {!state.shippingLocation ? (
                    <>
                      <Text variant="sm" color="black60">
                        Add your location
                      </Text>
                      <Box>
                        <ChevronIcon color="black60" />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Text variant="sm" color="black100" style={{ width: "70%" }}>
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
