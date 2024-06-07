import { Button, Flex, Touchable, Text } from "@artsy/palette-mobile"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/useCompleteProfile"
import { FC } from "react"

interface FooterProps {
  isFormDirty: boolean
  onGoNext: () => void
}

export const Footer: FC<FooterProps> = ({ isFormDirty, onGoNext }) => {
  const { goBack, isLoading } = useCompleteProfile()

  return (
    <Flex flexShrink={1} flexGrow={1} px={1} pt={2} pb={6} justifyContent="flex-end">
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
