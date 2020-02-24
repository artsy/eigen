import { Box, Button, Flex, Sans, Serif, Spacer, Theme } from "@artsy/palette"
import { CamIcon, MoneyIcon, OfferIcon, SellIcon } from "lib/Icons/Consignments"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { FlatList, Route, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import Overview from "./Overview"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
}

const rows = [
  {
    IconComponent: CamIcon,
    text: "Take a few photos and submit details about the work.",
  },
  {
    IconComponent: OfferIcon,
    text: "Get offers from galleries and auction houses.",
  },
  {
    IconComponent: SellIcon,
    text: "Have your work placed in a gallery or upcoming sale.",
  },
  {
    IconComponent: MoneyIcon,
    text: "Receive payment once the work sells.",
  },
]

@screenTrack({
  context_screen: Schema.PageNames.ConsignmentsWelcome,
  context_screen_owner_type: Schema.OwnerEntityTypes.Consignment,
})
export default class Welcome extends React.Component<Props> {
  goTapped = () => this.props.navigator.push({ component: Overview })
  render() {
    return (
      <Theme>
        <FlatList
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          data={rows}
          alwaysBounceVertical={false}
          keyExtractor={(_item, index) => String(index)}
          ListHeaderComponent={() => (
            <Box px={2}>
              <Sans size="4" textAlign="center" weight="medium">
                Sell works from your collection
              </Sans>
            </Box>
          )}
          renderItem={({ item }) => {
            const Icon = item.IconComponent
            return (
              <Flex px={2} alignItems="center" flexDirection="column">
                <Spacer mb={3} />
                <Flex
                  style={{ maxWidth: 450 }}
                  flexDirection="row"
                  alignItems="center"
                  flexWrap="nowrap"
                  justifyContent="center"
                >
                  <Icon />
                  <Spacer mr={2} />
                  <Flex style={{ flex: 1 }}>
                    <Serif size="4">{item.text}</Serif>
                  </Flex>
                </Flex>
              </Flex>
            )
          }}
          ListFooterComponent={() => (
            <>
              <Spacer mb={3} />
              <Flex flexDirection="column" alignItems="center">
                <Button onPress={this.goTapped}>Get started</Button>
                <Spacer mb={1} />
                <Button variant="noOutline" onPress={() => SwitchBoard.dismissModalViewController(this)}>
                  Close
                </Button>
              </Flex>
            </>
          )}
        />
      </Theme>
    )
  }
}
