import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import { Box, Button, Separator, Spacer } from "palette"
import React from "react"
import { View } from "react-native"

export interface BottomAlignedProps extends React.Props<JSX.Element> {
  onPress: () => void
  buttonText: string
  disabled?: boolean
  verticalOffset?: number
  showSeparator?: boolean
}

export const BottomAlignedButton: React.FC<BottomAlignedProps> = ({
  buttonText,
  onPress,
  children,
  disabled,
  showSeparator = true,
}) => (
  <ArtsyKeyboardAvoidingView>
    <View key="space-eater" style={{ flexGrow: 1 }}>
      {children}
    </View>
    {!!showSeparator && <Separator key="separator" />}
    <Spacer mb={1} />
    <Box px={2}>
      <Button
        accessibilityLabel={buttonText}
        block
        width="100%"
        onPress={onPress}
        disabled={disabled}
      >
        {buttonText}
      </Button>
    </Box>
    <Spacer mb={1} />
  </ArtsyKeyboardAvoidingView>
)
