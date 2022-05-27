import { useFeatureFlag } from "app/store/GlobalStore"
import { Text, Touchable, TouchableProps } from "palette"
import { FC } from "react"

export const SortButton: FC<TouchableProps> = (props) => {
  const enableSortByForAlerts = useFeatureFlag("AREnableSortByOnAlertsList")

  if (enableSortByForAlerts) {
    return (
      <Touchable {...props}>
        <Text>Sort By</Text>
      </Touchable>
    )
  }

  return null
}
