import { FancyModalHeader, FancyModalHeaderProps } from "lib/Components/FancyModal/FancyModalHeader"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { Box, Flex, Separator, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"

export interface ArtworkFilterOptionsHeaderProps extends FancyModalHeaderProps {
  title: string
  onLeftButtonPress: () => void
}

export const ArtworkFilterOptionsHeader: React.FC<ArtworkFilterOptionsHeaderProps> = (props) => {
  const {
    title,
    rightButtonDisabled,
    rightButtonText = "Clear",
    onLeftButtonPress,
    onRightButtonPress,
    useXButton,
    ...other
  } = props
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")

  if (isEnabledImprovedAlertsFlow) {
    return (
      <Box>
        <FancyModalHeader hideBottomDivider onLeftButtonPress={onLeftButtonPress} {...other} />
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between" p={2} pt={1}>
          <Text variant="lg">{title}</Text>
          {!!onRightButtonPress && (
            <TouchableOpacity disabled={rightButtonDisabled} onPress={onRightButtonPress}>
              <Text
                variant="sm"
                style={{ textDecorationLine: "underline" }}
                color={rightButtonDisabled ? "black30" : "black100"}
              >
                {rightButtonText}
              </Text>
            </TouchableOpacity>
          )}
        </Flex>
        <Separator />
      </Box>
    )
  }

  return (
    <FancyModalHeader
      onLeftButtonPress={onLeftButtonPress}
      rightButtonText={rightButtonText}
      onRightButtonPress={onRightButtonPress}
      rightButtonDisabled={rightButtonDisabled}
      useXButton={useXButton}
      {...other}
    >
      {title}
    </FancyModalHeader>
  )
}
