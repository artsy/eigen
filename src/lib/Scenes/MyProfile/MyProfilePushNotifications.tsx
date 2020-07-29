// tslint:disable:no-empty
import { Box, Button, color, Flex, Join, Sans, Separator } from "@artsy/palette"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import colors from "lib/data/colors"
import React from "react"
import { ScrollView, Switch } from "react-native"

interface SwitchMenuProps {
  onChange: () => void
  value: boolean
  title: string
  description: string
}

export const SwitchMenu = ({ onChange, value, title, description }: SwitchMenuProps) => (
  <Flex flexDirection="row" alignItems="flex-start" flexShrink={0} my={1}>
    <Flex style={{ width: "80%" }}>
      <Sans size="4t" color="black100">
        {title}
      </Sans>
      <Sans size="3t" color={colors["gray-semibold"]} py={0.5}>
        {description}
      </Sans>
    </Flex>
    <Flex style={{ width: "20%" }} alignItems="flex-end">
      <Switch
        trackColor={{ false: color("black10"), true: color("black100") }}
        onValueChange={onChange}
        value={value}
      />
    </Flex>
  </Flex>
)

export const MyProfilePushNotifications: React.FC<> = () => {
  const renderAllowPushNotificationsBanner = () => {
    return (
      <>
        <Flex py={3} px={2} backgroundColor={colors["gray-light"]} alignItems="center">
          <Sans size="4t" weight="medium" color="black">
            Turn on notifications
          </Sans>
          <Sans size="3t" color={colors["gray-semibold"]} marginTop="1" marginBottom="2">
            To receive push notifications from Artsy, you’ll need enable them in your iOS Settings. Tap Notifications,
            and then toggle “Allow Notifications” on.
          </Sans>
          <Button size="large">Open settings</Button>
        </Flex>
        <Separator />
      </>
    )
  }

  const renderContent = () => (
    <ScrollView>
      <Join separator={<Separator my={1} />}>
        <Box py={1} px={2}>
          <Sans size="4t" color="black100" weight="medium" py={1}>
            Purchase Updates
          </Sans>
          <SwitchMenu
            title="Messages"
            description="Messages from sellers on your inquiries"
            value
            onChange={() => {}}
          />
          <SwitchMenu
            title="Outbid Alerts"
            description="Alerts for when you’ve been outbid"
            value
            onChange={() => {}}
          />
          <SwitchMenu
            title="Messages"
            description="Messages from sellers on your inquiries"
            value
            onChange={() => {}}
          />
        </Box>
        <Box py={1} px={2}>
          <Sans size="4t" color="black100" weight="medium" py={1}>
            Reminders
          </Sans>
          <SwitchMenu
            title="Lot Opening Soon"
            description="Your lots that are opening for live bidding soon"
            value
            onChange={() => {}}
          />
          <SwitchMenu
            title="Auctions Starting and Closing"
            description="Your registered auctions that are starting or closing soon"
            value
            onChange={() => {}}
          />
        </Box>
        <Box py={1} px={2}>
          <Sans size="4t" color="black100" weight="medium" py={1}>
            Recommendations
          </Sans>
          <SwitchMenu
            title="New Works for You"
            description="New works added by artists you follow"
            value
            onChange={() => {}}
          />
          <SwitchMenu
            title="New Auctions for You"
            description="New auctions with artists you follow"
            value
            onChange={() => {}}
          />
          <SwitchMenu
            title="Promotions"
            description="Updates on Artsy’s latest campaigns and special offers."
            value
            onChange={() => {}}
          />
        </Box>
      </Join>
    </ScrollView>
  )

  return (
    <PageWithSimpleHeader title="Push Notifications">
      {renderAllowPushNotificationsBanner()}
      {renderContent()}
    </PageWithSimpleHeader>
  )
}
