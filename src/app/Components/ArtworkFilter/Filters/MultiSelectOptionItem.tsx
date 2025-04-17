import { Check, CHECK_SIZE, Flex, Box, useSpace, Text } from "@artsy/palette-mobile"
import { FilterData } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { TouchableRow } from "app/Components/TouchableRow"
import { useScreenDimensions } from "app/utils/hooks"
import React, { memo } from "react"
import styled from "styled-components/native"

const OPTIONS_MARGIN_LEFT = 0.5
const OPTION_PADDING = 15
export const MULTI_SELECT_OPTION_ITEM_HEIGHT = 50

interface MultiSelectOptionItemProps {
  item: FilterData
  selected: boolean
  disabled: boolean
  onPress: (item: FilterData) => void
}

const areEqual = (prevProps: MultiSelectOptionItemProps, nextProps: MultiSelectOptionItemProps) => {
  return (
    prevProps.selected === nextProps.selected &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.item.displayText === nextProps.item.displayText &&
    prevProps.onPress === nextProps.onPress
  )
}

export const MultiSelectOptionItem: React.FC<MultiSelectOptionItemProps> = memo(
  ({ item, disabled, selected, onPress }) => {
    const space = useSpace()
    const { width } = useScreenDimensions()
    const optionTextMaxWidth = width - OPTION_PADDING * 3 - space(OPTIONS_MARGIN_LEFT) - CHECK_SIZE

    return (
      <Box ml={OPTIONS_MARGIN_LEFT} height={MULTI_SELECT_OPTION_ITEM_HEIGHT}>
        <TouchableRow
          onPress={() => onPress(item)}
          disabled={disabled}
          testID="multi-select-option-button"
          accessibilityState={{ checked: selected }}
        >
          <OptionListItem>
            <Box maxWidth={optionTextMaxWidth}>
              <Text variant="xs" color="mono100">
                {item.displayText}
              </Text>
            </Box>

            <Check selected={selected} disabled={disabled} testID="multi-select-option-checkbox" />
          </OptionListItem>
        </TouchableRow>
      </Box>
    )
  },
  areEqual
)

export const OptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  align-items: flex-start;
  padding: ${OPTION_PADDING}px;
`
