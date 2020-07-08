import { color, Flex, Separator } from "@artsy/palette"
import { BottomTabsQuery } from "__generated__/BottomTabsQuery.graphql"
import { isStaging } from "lib/relay/config"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useInterval } from "lib/utils/useInterval"
import React, { useEffect, useRef } from "react"
import { graphql, QueryRenderer } from "react-relay"
import { BottomTabsButton } from "./BottomTabsButton"
import { ICON_HEIGHT } from "./BottomTabsIcon"

const BottomTabs: React.FC<{ unreadConversationCount: number }> = ({ unreadConversationCount }) => {
  return (
    <Flex flex={1}>
      <Separator style={{ borderColor: isStaging ? color("purple100") : color("black10") }} />
      <Flex flexDirection="row" height={ICON_HEIGHT} px={1}>
        <BottomTabsButton tab="home" />
        <BottomTabsButton tab="search" />
        <BottomTabsButton tab="inbox" badgeCount={unreadConversationCount} />
        <BottomTabsButton tab="sell" />
        <BottomTabsButton tab="profile" />
      </Flex>
    </Flex>
  )
}

export const BottomTabsQueryRenderer: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const reload = useRef<() => any>()
  useInterval(() => {
    if (isVisible) {
      reload.current?.()
    }
  }, 1000 * 60)

  useEffect(() => {
    if (isVisible) {
      reload.current?.()
    }
  }, [isVisible])

  return (
    <QueryRenderer<BottomTabsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query BottomTabsQuery {
          me {
            unreadConversationCount
          }
        }
      `}
      render={data => {
        reload.current = data.retry ?? undefined
        return <BottomTabs unreadConversationCount={data.props?.me?.unreadConversationCount ?? 0} />
      }}
      variables={{}}
      cacheConfig={{ force: true }}
    />
  )
}
