import { storiesOf } from "@kadira/react-native-storybook"
import * as React from "react"
import { RootContainer } from "react-relay"

import Artist from "../../../containers/artist"
import Routes from "../../../relay/routes"

storiesOf("Artist")
  .add("Glenn Brown", () => {
    const artistRoute = new Routes.Artist({ artistID: "glenn-brown" })
    return <RootContainer Component={Artist} route={artistRoute} />
  })
  .add("Leda Catunda", () => {
    const artistRoute = new Routes.Artist({ artistID: "leda-catunda" })
    return <RootContainer Component={Artist} route={artistRoute} />
  })
  .add("Jorge Vigil", () => {
    const artistRoute = new Routes.Artist({ artistID: "jorge-vigil" })
    return <RootContainer Component={Artist} route={artistRoute} />
  })
  .add("Rita Maas", () => {
    const artistRoute = new Routes.Artist({ artistID: "rita-maas" })
    return <RootContainer Component={Artist} route={artistRoute} />
  })
