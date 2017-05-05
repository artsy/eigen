import { storiesOf } from "@kadira/react-native-storybook"
import * as React from "react"
import { RootContainer } from "react-relay"

import Routes from "../../relay/routes"
import MyProfile from "../my_profile"

storiesOf("My Profile")
  .add("Root", () => {
    const profileRoute = new Routes.MyProfile()
    return <RootContainer Component={MyProfile} route={profileRoute} />
  })
