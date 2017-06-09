import * as _ from "lodash"
import * as React from "react"
import { AppRegistry, ViewProperties } from "react-native"
import * as Relay from "react-relay/classic"

import Consignments from "./Components/Consignments"
import LoadFailureView from "./Components/LoadFailureView"
import Spinner from "./Components/Spinner"
import Containers from "./Containers/index"
import Routes from "./relay/routes"

interface Props extends ViewProperties {
  trigger1pxScrollHack?: boolean
}

class RootContainer extends React.Component<Props, {}> {
  state: { retrying: boolean }
  component: Relay.RelayContainerClass<any>
  route: Relay.Route
  renderFetched?: Relay.RootContainerProps["renderFetched"]
  forceFetch: boolean

  constructor(props) {
    super(props)
    this.state = { retrying: false }
    this.forceFetch = false
  }

  render() {
    // FIXME: These props are missing from the DefinitelyTyped package.
    const untypedProps: any = { forceFetch: this.forceFetch }

    // https://facebook.github.io/relay/docs/guides-root-container.html
    return (
      <Relay.RootContainer
        Component={this.component}
        route={this.route}
        renderFetched={this.renderFetched}
        renderLoading={() => {
          if (this.state.retrying) {
            // This will re-use the native view first created in the renderFailure callback, which means it can
            // continue its ‘retry’ animation.
            return <LoadFailureView style={{ flex: 1 }} />
          } else {
            return <Spinner style={{ flex: 1 }} />
          }
        }}
        renderFailure={(error, retry) => {
          this.state.retrying = true
          return <LoadFailureView onRetry={retry} style={{ flex: 1 }} />
        }}
        {...untypedProps}
      />
    )
  }
}

class Artist extends RootContainer {
  constructor(props) {
    super(props)
    this.component = Containers.Artist
    this.route = new Routes.Artist({ artistID: props.artistID })
  }
}

class Gene extends RootContainer {
  constructor(props) {
    super(props)
    this.component = Containers.Gene

    const medium = _.get(props, "refineSettings.medium")
    const priceRange = _.get(props, "refineSettings.price_range") as string

    this.route = new Routes.Gene({
      geneID: props.geneID,
      medium: medium ? medium : "*",
      // The replace can be removed once metaphysics#486 is merged
      price_range: priceRange ? priceRange.replace(/\.00/g, "") : "*-*",
    })
  }
}

class Home extends RootContainer {
  constructor(props) {
    super(props)
    this.component = Containers.Home
    this.route = new Routes.Home()
    this.renderFetched = data => <Containers.Home {...data} trigger1pxScrollHack={this.props.trigger1pxScrollHack} />
  }
}

class WorksForYou extends RootContainer {
  constructor(props) {
    super(props)

    this.component = Containers.WorksForYou
    this.route = new Routes.WorksForYou({ selectedArtist: props.selectedArtist })
    this.renderFetched = data =>
      <Containers.WorksForYou {...data} trigger1pxScrollHack={this.props.trigger1pxScrollHack} />
  }
}

class MyAccount extends RootContainer {
  constructor(props) {
    super(props)
    this.component = Containers.MyAccount
    this.route = new Routes.MyAccount()
  }
}

class Inbox extends RootContainer {
  constructor(props) {
    super(props)
    this.component = Containers.Inbox
    this.route = new Routes.MyAccount()
    this.forceFetch = true
  }
}

class Conversation extends RootContainer {
  constructor(props) {
    super(props)
    this.component = Containers.Conversation
    this.route = new Routes.Conversation({ conversationID: props.conversationID })
  }
}

class Inquiry extends RootContainer {
  constructor(props) {
    super(props)
    this.component = Containers.Inquiry
    this.route = new Routes.Inquiry({ artworkID: props.artworkID })
  }
}

AppRegistry.registerComponent("Consignments", () => Consignments)
AppRegistry.registerComponent("Artist", () => Artist)
AppRegistry.registerComponent("Home", () => Home)
AppRegistry.registerComponent("Gene", () => Gene)
AppRegistry.registerComponent("WorksForYou", () => WorksForYou)
AppRegistry.registerComponent("MyAccount", () => MyAccount)
AppRegistry.registerComponent("Inbox", () => Inbox)
AppRegistry.registerComponent("Conversation", () => Conversation)
AppRegistry.registerComponent("Inquiry", () => Inquiry)
