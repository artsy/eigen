import { Button, Flex, Touchable, Text } from "@artsy/palette-mobile"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/useCompleteProfile"
import { FC } from "react"
import { Platform } from "react-native"

interface FooterProps {
  isFormDirty: boolean
  onGoNext: () => void
}

export const Footer: FC<FooterProps> = ({ isFormDirty, onGoNext }) => {
  const { goBack, isLoading } = useCompleteProfile()

  return (
    <Flex pt={2} pb={Platform.OS === "ios" ? 4 : 2} justifyContent="flex-end">
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
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
