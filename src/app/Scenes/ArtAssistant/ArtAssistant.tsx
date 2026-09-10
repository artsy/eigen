import { CloseIcon, MagicMagnifyingGlassIcon } from "@artsy/icons/native"
import {
  DEFAULT_HIT_SLOP,
  Flex,
  Input,
  Screen,
  Text,
  Touchable,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import { goBack } from "app/system/navigation/navigate"
import { useState } from "react"
import { LayoutChangeEvent, StyleSheet } from "react-native"
import { KeyboardStickyView } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const ART_ASSISTANT_SUGGESTIONS = [
  "Large blue abstract painting for a living room, under $10k",
  "Emerging photographers showing in Berlin right now",
  "Something like Ruth Asawa but I can actually afford",
]

interface ArtAssistantProps {
  onClose?: () => void
}

export const ArtAssistant: React.FC<ArtAssistantProps> = ({ onClose = goBack }) => {
  const color = useColor()
  const space = useSpace()
  const { bottom } = useSafeAreaInsets()
  const [prompt, setPrompt] = useState("")
  const [composerHeight, setComposerHeight] = useState(0)
  const composerKeyboardGap = space(1)

  const handleComposerLayout = (event: LayoutChangeEvent) => {
    setComposerHeight(event.nativeEvent.layout.height)
  }

  return (
    <Screen>
      <Screen.Header
        hideLeftElements
        hideTitle
        rightElements={
          <Touchable
            accessibilityLabel="Close Art Assistant"
            accessibilityRole="button"
            hitSlop={DEFAULT_HIT_SLOP}
            onPress={() => onClose()}
            underlayColor="transparent"
          >
            <CloseIcon fill="mono100" />
          </Touchable>
        }
      />

      <Flex flex={1}>
        <Screen.ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: composerHeight }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          testID="art-assistant-content"
        >
          <Flex flex={1} px={2} pt={4} pb={2}>
            <Flex flexDirection="row" alignItems="center" justifyContent="center">
              <MagicMagnifyingGlassIcon fill="mono60" width={28} height={28} />
              <Text variant="sm" color="mono60" ml={0.5} caps>
                Art Assistant
              </Text>
            </Flex>

            <Text variant="lg" textAlign="center" mt={2}>
              What are you looking for?
            </Text>

            <Text variant="sm" color="mono60" textAlign="center" mt={1} mb={2}>
              Describe it the way you'd describe it to a friend — medium, mood, color, budget. I'll
              do the filtering.
            </Text>

            <Flex gap={1}>
              {ART_ASSISTANT_SUGGESTIONS.map((suggestion) => (
                <Touchable
                  accessibilityRole="button"
                  key={suggestion}
                  onPress={() => setPrompt(suggestion)}
                  underlayColor="mono5"
                  style={{ borderRadius: 20, overflow: "hidden" }}
                >
                  <Flex
                    borderColor="mono15"
                    borderRadius={20}
                    borderWidth={StyleSheet.hairlineWidth}
                    justifyContent="center"
                    minHeight={56}
                    px={2}
                    py={1}
                  >
                    <Text variant="sm">{suggestion}</Text>
                  </Flex>
                </Touchable>
              ))}
            </Flex>
          </Flex>
        </Screen.ScrollView>

        <KeyboardStickyView
          offset={{ opened: bottom }}
          onLayout={handleComposerLayout}
          testID="art-assistant-composer"
        >
          <Flex
            flexDirection="row"
            alignItems="center"
            backgroundColor="background"
            gap={1}
            pb={`${bottom + composerKeyboardGap}px`}
            px={2}
            pt={1}
          >
            <Flex
              flex={1}
              borderColor="mono15"
              borderRadius={50}
              borderWidth={StyleSheet.hairlineWidth}
              minHeight={50}
              justifyContent="center"
              px={2}
            >
              <Input
                accessibilityLabel="Art Assistant prompt"
                multiline
                onChangeText={setPrompt}
                placeholder="Tell us what you'd like..."
                placeholderTextColor={color("mono60")}
                style={{
                  borderWidth: 0,
                  height: undefined,
                  maxHeight: 100,
                  minHeight: 50,
                  paddingHorizontal: 0,
                }}
                value={prompt}
              />
            </Flex>

            <Touchable
              accessibilityLabel="Send"
              accessibilityRole="button"
              accessibilityState={{ disabled: true }}
              disabled
              style={{ borderRadius: 50, overflow: "hidden" }}
            >
              <Flex
                alignItems="center"
                backgroundColor="mono30"
                borderRadius={50}
                height={50}
                justifyContent="center"
                px={2}
              >
                <Text variant="sm" color="mono0">
                  Send
                </Text>
              </Flex>
            </Touchable>
          </Flex>
        </KeyboardStickyView>
      </Flex>
    </Screen>
  )
}
