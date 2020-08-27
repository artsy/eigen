import { color, Flex, Separator, Text } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { capitalize } from "lodash"
import React from "react"
import { TouchableHighlight, View } from "react-native"
import { LotStanding, Sale } from "../shared"

export class Lot extends React.Component<{ ls: LotStanding; sale?: Sale }> {
  render() {
    const { ls, sale, children } = this.props

    return (
      <TouchableHighlight
        underlayColor={color("white100")}
        activeOpacity={0.8}
        onPress={() => SwitchBoard.presentNavigationViewController(this, ls?.saleArtwork?.artwork?.href as string)}
      >
        <View>
          <Flex my="1" flexDirection="row">
            <Flex mr="1">
              <OpaqueImageView width={60} height={60} imageURL={ls?.saleArtwork?.artwork?.image?.url} />
            </Flex>

            <Flex flexGrow={1} flexShrink={1}>
              <Text variant="caption">{ls?.saleArtwork?.artwork?.artistNames}</Text>
              <Text variant="caption">Lot {ls?.saleArtwork?.lotLabel}</Text>
              {!!sale && (
                <Text variant="caption" color="black60">
                  {capitalize(sale.displayTimelyAt as string)}
                </Text>
              )}
            </Flex>

            <Flex flexGrow={1} alignItems="flex-end">
              {children}
            </Flex>
          </Flex>

          <Separator my="1" />
        </View>
      </TouchableHighlight>
    )
  }
}
