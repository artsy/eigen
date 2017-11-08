import * as _ from "lodash"
import React from "react"
import { AppRegistry, ViewProperties } from "react-native"
import { track } from "./utils/track"

import Consignments from "./Components/Consignments"
import Containers from "./Containers/index"
import renderWithLoadProgress from "./utils/renderWithLoadProgress"

import {
  ArtistRenderer,
  ConversationRenderer,
  GeneRenderer,
  HomeRenderer,
  InboxRenderer,
  InquiryRenderer,
  MyProfileRenderer,
  RenderCallback,
  WorksForYouRenderer,
} from "./relay/QueryRenderers"

import HomeScene from "./Scenes/Home"

import Events from "./NativeModules/Events"

interface Props extends ViewProperties {
  trigger1pxScrollHack?: boolean
}

// Analytics wrapper for all of our top level React components
function AddTrack(pageName: string) {
  return track(
    // Here we assign the source screen to all subsequent events fired from that component
    { page: pageName },
    // Here we're hooking into Eigen to post analytics events to Adjust and Segement
    { dispatch: data => Events.postEvent(data) }
  )
}

const Artist: React.SFC<{ artistID: string; isPad: boolean }> = AddTrack("Artist")(props =>
  <ArtistRenderer {...props} render={renderWithLoadProgress(Containers.Artist, props)} />
)

const Inbox: React.SFC<{}> = () => <InboxRenderer render={renderWithLoadProgress(Containers.Inbox)} />

const Gene: React.SFC<{ geneID: string; refineSettings: { medium: string; price_range: string } }> = ({
  geneID,
  refineSettings: { medium, price_range },
}) => {
  const initialProps = { geneID, medium, price_range }
  return <GeneRenderer {...initialProps} render={renderWithLoadProgress(Containers.Gene, initialProps)} />
}

// TODO: This was required to trigger the 1px wake-up hack (in case the scrollview goes blank)
//
//     this.renderFetched = data => <Containers.Home {...data} trigger1pxScrollHack={this.props.trigger1pxScrollHack} />
const Home: React.SFC<{}> = () => <HomeRenderer render={renderWithLoadProgress(Containers.Home)} />

// TODO: This was required to trigger the 1px wake-up hack (in case the scrollview goes blank)
//
//     this.renderFetched = data => <Containers.WorksForYou {...data} trigger1pxScrollHack={this.props.trigger1pxScrollHack} />
const WorksForYou: React.SFC<{ selectedArtist: string }> = props =>
  <WorksForYouRenderer {...props} render={renderWithLoadProgress(Containers.WorksForYou, props)} />

const Inquiry: React.SFC<{ artworkID: string }> = props =>
  <InquiryRenderer {...props} render={renderWithLoadProgress(Containers.Inquiry, props)} />

const Conversation: React.SFC<{ conversationID: string }> = props =>
  <ConversationRenderer {...props} render={renderWithLoadProgress(Containers.Conversation, props)} />

const MyProfile: React.SFC<{}> = () => <MyProfileRenderer render={renderWithLoadProgress(Containers.MyProfile)} />

AppRegistry.registerComponent("Consignments", () => Consignments)
AppRegistry.registerComponent("Artist", () => Artist)
AppRegistry.registerComponent("Home", () => HomeScene)
AppRegistry.registerComponent("Gene", () => Gene)
AppRegistry.registerComponent("WorksForYou", () => WorksForYou)
AppRegistry.registerComponent("MyProfile", () => MyProfile)
AppRegistry.registerComponent("MyAccount", () => MyProfile) // TODO: deprecate on a new Eigen build
AppRegistry.registerComponent("Inbox", () => Inbox)
AppRegistry.registerComponent("Conversation", () => Conversation)
AppRegistry.registerComponent("Inquiry", () => Inquiry)
