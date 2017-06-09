import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import * as Relay from "react-relay/classic"

import Routes from "../../relay/routes"
import Artist from "../Artist"

storiesOf("Artist/Relay")
  .add("Glenn Brown", () => {
    const artistRoute = new Routes.Artist({ artistID: "glenn-brown" })
    return <Relay.RootContainer Component={Artist} route={artistRoute} />
  })
  .add("Leda Catunda", () => {
    const artistRoute = new Routes.Artist({ artistID: "leda-catunda" })
    return <Relay.RootContainer Component={Artist} route={artistRoute} />
  })
  .add("Jorge Vigil", () => {
    const artistRoute = new Routes.Artist({ artistID: "jorge-vigil" })
    return <Relay.RootContainer Component={Artist} route={artistRoute} />
  })
  .add("Rita Maas", () => {
    const artistRoute = new Routes.Artist({ artistID: "rita-maas" })
    return <Relay.RootContainer Component={Artist} route={artistRoute} />
  })
