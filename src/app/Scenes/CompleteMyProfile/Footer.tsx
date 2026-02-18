import { Button, Flex, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { FC } from "react"
import { KeyboardStickyView } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface FooterProps {
  isFormDirty: boolean
  onGoNext: () => void
}

export const Footer: FC<FooterProps> = ({ isFormDirty, onGoNext }) => {
  const { bottom } = useSafeAreaInsets()
  const space = useSpace()
  const { goBack } = useCompleteProfile()
  const isLoading = CompleteMyProfileStore.useStoreState((state) => state.isLoading)

  return (
    <KeyboardStickyView offset={{ opened: bottom - space(2) }}>
      <Flex justifyContent="flex-end" justifySelf="flex-end" pt={6} height="auto">
        <Flex
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          pb={`${bottom}px`}
          borderTopWidth={1}
          borderTopColor="mono10"
        >
          <Touchable accessibilityRole="button" onPress={goBack}>
            <Text underline>Back</Text>
          </Touchable>

          <Button
            onPress={onGoNext}
            variant={isFormDirty ? "fillDark" : "outline"}
            loading={isLoading}
          >
            {isFormDirty ? "Continue" : "Skip"}
          </Button>
        </Flex>
      </Flex>
    </KeyboardStickyView>
  )
}
