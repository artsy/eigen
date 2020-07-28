import { Theme } from "@artsy/palette"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import React from "react"

// @ts-ignore
export const MyProfilePushNotifications: React.FC<> = () => {
  return (
    <Theme>
      <PageWithSimpleHeader title="Push Notifications"></PageWithSimpleHeader>
    </Theme>
  )
}
