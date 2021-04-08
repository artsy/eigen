import { useFeatureFlag } from "lib/store/GlobalStore"
import { color, Touchable, TouchableProps } from "palette"
import React from "react"

export type TouchableRowProps = TouchableProps

export const TouchableRow: React.FC<TouchableRowProps> = ({ children, ...rest }) => {
  const shouldUseImprovedArtworkFilters = useFeatureFlag("ARUseImprovedArtworkFilters")

  if (shouldUseImprovedArtworkFilters) {
    return (
      <Touchable underlayColor={color("black5")} {...rest}>
        {children}
      </Touchable>
    )
  }

  return <Touchable {...rest}>{children}</Touchable>
}
