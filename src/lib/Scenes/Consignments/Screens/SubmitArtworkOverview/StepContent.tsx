import { track as _track } from "lib/utils/track"
import { Button, Flex, Sans, Spacer } from "palette"
import React from "react"
import { View } from "react-native"

interface Props {
  title: string | null
  content: string | React.FC | any
  setStepCompleted: any
}
export const StepContent: React.FC<Props> = ({ content = "content content content", setStepCompleted }) => {
  // const [isFormComplete, setIsFormComplete] = useState(false)

  // const checkIfFormIsCompleted = () => {
  //   // Check conditions
  //   // setIsFormComplete()
  // }

  return (
    <View>
      <Sans size="4" mx="2" mt="2" color="gray">
        {content}
      </Sans>
      <Spacer mb={2} />

      <Flex px="2" width="100%" alignItems="center">
        <Button
          maxWidth={540}
          block
          onPress={() => {
            // setStepCompleted(!isFormComplete)
            // setIsFormComplete(!isFormComplete)
          }}
          // disabled={!canSubmit}
          haptic
        >
          Save & Continue
        </Button>
      </Flex>
    </View>
  )
}
