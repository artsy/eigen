import { CollapsableHeader } from "lib/Components/CollapsableHeader/CollapsableHeader"
import { FancyModalHeader, FancyModalHeaderProps } from "lib/Components/FancyModal/FancyModalHeader"
import { useFeatureFlag } from "lib/store/GlobalStore"
import React from "react"

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
      <CollapsableHeader
        title={title}
        rightButtonText={rightButtonText}
        rightButtonDisabled={rightButtonDisabled}
        onLeftButtonPress={onLeftButtonPress}
        onRightButtonPress={onRightButtonPress}
      />
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
