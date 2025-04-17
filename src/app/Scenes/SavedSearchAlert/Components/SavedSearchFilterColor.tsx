import { Flex, Separator, Spacer, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import {
  COLORS_INDEXED_BY_VALUE,
  COLOR_OPTIONS,
  SWATCHES_PER_ROW,
} from "app/Components/ArtworkFilter/Filters/ColorsOptions"
import { ColorsSwatch } from "app/Components/ArtworkFilter/Filters/ColorsSwatch"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { useSearchCriteriaAttributes } from "app/Scenes/SavedSearchAlert/helpers"
import { useEffect, useState } from "react"
import useDebounce from "react-use/lib/useDebounce"

export const SavedSearchFilterColor = () => {
  const { width } = useScreenDimensions()
  const space = useSpace()

  const selectedStoreColors = useSearchCriteriaAttributes(SearchCriteria.colors) as string[]
  const setAttribute = SavedSearchStore.useStoreActions((actions) => actions.setAttributeAction)

  const [selectedColors, setSelectedColors] = useState(selectedStoreColors || [])

  useEffect(() => {
    selectedStoreColors ? setSelectedColors(selectedStoreColors) : setSelectedColors([])
  }, [selectedStoreColors])

  useDebounce(
    () => {
      setAttribute({ key: SearchCriteria.colors, value: selectedColors })
    },
    100,
    [selectedColors]
  )

  const handlePress = (value: string) => () => {
    setSelectedColors((prev) =>
      selectedColors.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  return (
    <Flex>
      <Separator my={2} borderColor="mono10" />
      <Text px={2} variant="sm" fontWeight="bold">
        Color
      </Text>

      <Spacer y={1} />

      <Flex flexDirection="row" flexWrap="wrap" px={1}>
        {COLOR_OPTIONS.map((option, i) => {
          const color = COLORS_INDEXED_BY_VALUE[String(option.paramValue)]

          return (
            <ColorsSwatch
              key={i}
              width={(width - space(1) * 2) / SWATCHES_PER_ROW}
              selected={selectedColors.includes(option.paramValue as string)}
              name={color.name}
              backgroundColor={color.backgroundColor}
              onPress={handlePress(option.paramValue as string)}
            />
          )
        })}
      </Flex>
    </Flex>
  )
}
