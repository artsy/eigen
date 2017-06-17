import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { RootContainer } from "react-relay"

import Routes from "../../relay/routes"
import MyAccount from "../MyAccount"

storiesOf("My Account").add("Root", () => {
  const profileRoute = new Routes.MyAccount()
  return <RootContainer Component={MyAccount} route={profileRoute} />
})
