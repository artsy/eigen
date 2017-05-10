import { storiesOf } from "@kadira/react-native-storybook"
import * as React from "react"
import { RootContainer } from "react-relay"

import Routes from "../../relay/routes"
import MyAccount from "../my_account"

storiesOf("My Account")
  .add("Root", () => {
    const profileRoute = new Routes.MyAccount()
    return <RootContainer Component={MyAccount} route={profileRoute} />
  })
