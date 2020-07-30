import { Text, View } from "react-native"
import React from "react"
import { Flex, Message, Sans, Theme } from "@artsy/palette"
import ScrollableTabView from "react-native-scrollable-tab-view"

import ScrollableTabBar, { ScrollableTab } from "../../Components/ScrollableTabBar"
import { ProvideScreenDimensions } from "../../utils/useScreenDimensions"
import { StickyTabPage } from "../../Components/StickyTabPage/StickyTabPage"
import ArtistHeader from "../../Components/Artist/ArtistHeader"
import { ProvideScreenTracking } from "../../utils/track"
import { StickyTabPageScrollView } from "../../Components/StickyTabPage/StickyTabPageScrollView"

export const MyBids = () => (
  <Theme>
    <ProvideScreenDimensions>
      <Flex style={{ flex: 1 }}>
        <StickyTabPage
          staticHeaderContent={
            <View style={{ marginTop: 20 }}>
              <Sans size="4" weight="medium" textAlign="center">
                My Bids
              </Sans>
            </View>
          }
          tabs={[
            {
              title: "Upcoming",
              content: (
                <StickyTabPageScrollView>
                  <View>
                    <Text>
                      There aren’t any works available by the artist at this time. Follow to receive notifications when
                      new works are added.
                    </Text>
                  </View>
                </StickyTabPageScrollView>
              ),
            },
            {
              title: "Recently Closed",
              content: (
                <StickyTabPageScrollView>
                  <View>
                    <Text>
                      There aren’t any works available by the artist at this time. Follow to receive notifications when
                      new works are added.
                    </Text>
                  </View>
                </StickyTabPageScrollView>
              ),
            },
          ]}
        />
      </Flex>
    </ProvideScreenDimensions>
  </Theme>
)
