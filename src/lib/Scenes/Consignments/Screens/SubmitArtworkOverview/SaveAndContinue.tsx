import { track as _track } from "lib/utils/track"
import { Button, Flex, Spacer } from "palette"
import React from "react"
import { View } from "react-native"

interface Props {
  content?: string | React.FC | any
}
export const SaveAndContinue: React.FC<Props> = (
  {
    // content = "Which component's things should we save and continue....",
    // setStepCompleted
  }
) => {
  // const [isFormComplete, setIsFormComplete] = useState(false)

  // const checkIfFormIsCompleted = () => {
  //   // Check conditions
  //   // setIsFormComplete()
  // }

  return (
    <View>
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
