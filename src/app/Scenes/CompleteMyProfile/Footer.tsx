import { Button, Flex, Touchable, Text } from "@artsy/palette-mobile"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { FC } from "react"
import { Platform } from "react-native"

interface FooterProps {
  isFormDirty: boolean
  onGoNext: () => void
}

export const Footer: FC<FooterProps> = ({ isFormDirty, onGoNext }) => {
  const { goBack } = useCompleteProfile()
  const isLoading = CompleteMyProfileStore.useStoreState((state) => state.isLoading)

  return (
    <Flex justifyContent="flex-end" justifySelf="flex-end" pt={6} height="auto">
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        pt={2}
        pb={Platform.OS === "ios" ? 4 : 2}
        px={2}
        borderTopWidth={1}
        borderTopColor="mono10"
      >
        <Touchable onPress={goBack}>
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
  )
}
