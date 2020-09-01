import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, Separator, Spacer } from "palette"
import React from "react"
import { KeyboardAvoidingView, View } from "react-native"

export interface BottomAlignedProps extends React.Props<JSX.Element> {
  onPress: () => void
  buttonText: string
  disabled?: boolean
  verticalOffset?: number
}

export const BottomAlignedButton: React.FC<BottomAlignedProps> = ({ buttonText, onPress, children, disabled }) => (
  <KeyboardAvoidingView
    behavior="padding"
    keyboardVerticalOffset={useScreenDimensions().safeAreaInsets.top}
    style={{ flex: 1 }}
  >
    <View key="space-eater" style={{ flexGrow: 1 }}>
      {children}
    </View>
    <Separator key="separator" />
    <Spacer mb={1} />
    <Box px={2}>
      <Button block width="100%" onPress={onPress} disabled={disabled}>
        {buttonText}
      </Button>
    </Box>
    <Spacer mb={1} />
  </KeyboardAvoidingView>
)
