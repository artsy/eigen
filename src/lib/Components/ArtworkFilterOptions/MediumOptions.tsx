import { ArrowLeftIcon, Box, CheckIcon, Flex, Sans, Serif, space } from "@artsy/palette"
import React, { useContext } from "react"
import { FlatList, TouchableOpacity } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"
import { ArtworkFilterContext, MediumOption, useSelectedOptionsDisplay } from "../../utils/ArtworkFiltersStore"
import { BackgroundFill, OptionListItem } from "../FilterModal"

interface MediumOptionsScreenProps {
  navigator: NavigatorIOS
}

export const MediumOptionsScreen: React.SFC<MediumOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)

  const handleBackNavigation = () => {
    navigator.pop()
  }

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedMediumOption = selectedOptions.find(option => option.filterType === "medium")?.value

  const selectMediumOption = (selectedOption: MediumOption) => {
    dispatch({ type: "selectFilters", payload: { value: selectedOption, filterType: "medium" } })
  }

  return (
    <Flex flexGrow={1}>
      <FilterHeader>
        <Flex alignItems="flex-end" mt={0.5} mb={2}>
          <ArrowLeftIconContainer onPress={() => handleBackNavigation()}>
            <ArrowLeftIcon fill="black100" />
          </ArrowLeftIconContainer>
        </Flex>
        <Sans mt={2} weight="medium" size="4" color="black100">
          Medium
        </Sans>
        <Box></Box>
      </FilterHeader>
      <Flex mb={120}>
        <FlatList<MediumOption>
          initialNumToRender={12}
          keyExtractor={(_item, index) => String(index)}
          data={mediumFilterOptions}
          renderItem={({ item }) => (
            <Box>
              {
                <MediumOptionListItemRow onPress={() => selectMediumOption(item)}>
                  <OptionListItem>
                    <InnerOptionListItem>
                      <MediumSelection color="black100" size="3t">
                        {item}
                      </MediumSelection>
                      {item === selectedMediumOption && (
                        <Box mb={0.1}>
                          <CheckIcon fill="black100" />
                        </Box>
                      )}
                    </InnerOptionListItem>
                  </OptionListItem>
                </MediumOptionListItemRow>
              }
            </Box>
          )}
        />
      </Flex>
      <BackgroundFill />
    </Flex>
  )
}
export const FilterHeader = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  padding-right: ${space(2)};
`

export const ArrowLeftIconContainer = styled(TouchableOpacity)`
  margin-top: ${space(2)};
  margin-left: ${space(2)};
`

export const InnerOptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  align-items: flex-end;
  padding: ${space(2)}px;
`

const mediumFilterOptions: MediumOption[] = [
  "All",
  "Painting",
  "Photography",
  "Sculpture",
  "Prints & multiples",
  "Works on paper",
  "Design",
  "Drawing",
  "Installation",
  "Film & video",
  "Jewelry",
  "Drawing",
  "Installation",
  "Performance art",
]

export const MediumOptionListItemRow = styled(TouchableOpacity)``
export const MediumSelection = styled(Serif)``
