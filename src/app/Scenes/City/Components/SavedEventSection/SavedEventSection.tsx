import { Flex, Box, Text } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import ChevronIcon from "app/Components/Icons/ChevronIcon"
import PinSavedOff from "app/Components/Icons/PinSavedOff"
import PinSavedOn from "app/Components/Icons/PinSavedOn"
import { navigate } from "app/system/navigation/navigate"
import { Track, track as _track } from "app/utils/track"
import { Component } from "react"
import { TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

export interface Props {
  data: any
  citySlug: string
}

const track: Track<Props, {}> = _track as any

@track()
export class SavedEventSection extends Component<any> {
  handleTap = () => {
    navigate(`/city-save/${this.props.citySlug}`)
  }

  // @TODO: Implement test for this component https://artsyproduct.atlassian.net/browse/LD-562
  render() {
    const { data } = this.props
    const hasSaves = data.length > 0
    const hasSavesComponent = (
      <TouchableWithoutFeedback accessibilityRole="button" onPress={this.handleTap}>
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Flex flexDirection="row" alignItems="center">
            <PinSavedOn pinWidth={30} pinHeight={30} />
            <Text variant="sm" weight="medium" ml={24}>
              {data.length > 1 ? data.length + " saved events" : data.length + " saved event"}
            </Text>
          </Flex>
          <ChevronIcon color="mono100" />
        </Flex>
      </TouchableWithoutFeedback>
    )

    const hasNoSavesComponent = (
      <>
        <Flex flexDirection="row" alignItems="center">
          <PinSavedOff width={30} height={30} />
          <Flex ml="24px">
            <Text variant="sm" color="mono60" weight="medium">
              No saved events
            </Text>
            <Text variant="sm" color="mono60">
              Save a show to find it later
            </Text>
          </Flex>
        </Flex>
      </>
    )

    return (
      <>
        <Box my={2}>
          <SavedBox p={1}>{hasSaves ? hasSavesComponent : hasNoSavesComponent}</SavedBox>
        </Box>
      </>
    )
  }
}

const SavedBox = styled(Box)`
  border-radius: 2px;
  border-width: 1px;
  border-color: ${themeGet("colors.mono30")};
`
