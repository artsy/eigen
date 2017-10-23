import * as _ from "lodash"
import * as React from "react"
import { AppRegistry, ViewProperties } from "react-native"
import { TrackingInfo } from "react-tracking"
import { Schema, Track, track as _track } from "./utils/track"

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
  MyAccountRenderer,
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
  return component => component
}

function track<P>(trackingInfo: TrackingInfo<Schema.PageView, P, null>) {
  return _track(trackingInfo as any, {
    dispatch: data => Events.postEvent(data),
    dispatchOnMount: true,
  })
}

interface ArtistProps {
  artistID: string
  isPad: boolean
}
const Artist: React.SFC<ArtistProps> = track<ArtistProps>(props => {
  return { page: "Artist", entity_id: props.artistID }
})(props => <ArtistRenderer {...props} render={renderWithLoadProgress(Containers.Artist, props)} />)

const Inbox: React.SFC<{}> = track<{}>(props => {
  return { page: "Inbox", entity_id: null }
})(() => <InboxRenderer render={renderWithLoadProgress(Containers.Inbox)} />)

interface GeneProps {
  geneID: string
  refineSettings: { medium: string; price_range: string }
}

const Gene: React.SFC<GeneProps> = ({ geneID, refineSettings: { medium, price_range } }) => {
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

interface InquiryProps {
  artworkID: string
}
const Inquiry: React.SFC<InquiryProps> = track<InquiryProps>(props => {
  return { page: "Inquiry", entity_id: props.artworkID }
})(props => <InquiryRenderer {...props} render={renderWithLoadProgress(Containers.Inquiry, props)} />)

interface ConversationProps {
  conversationID: string
}
const Conversation: React.SFC<ConversationProps> = track<ConversationProps>(props => {
  return { page: "Conversation", entity_id: props.conversationID }
})(props => <ConversationRenderer {...props} render={renderWithLoadProgress(Containers.Conversation, props)} />)

const MyAccount: React.SFC<{}> = () => <MyAccountRenderer render={renderWithLoadProgress(Containers.MyAccount)} />

AppRegistry.registerComponent("Consignments", () => Consignments)
AppRegistry.registerComponent("Artist", () => Artist)
AppRegistry.registerComponent("Home", () => HomeScene)
AppRegistry.registerComponent("Gene", () => Gene)
AppRegistry.registerComponent("WorksForYou", () => WorksForYou)
AppRegistry.registerComponent("MyAccount", () => MyAccount)
AppRegistry.registerComponent("Inbox", () => Inbox)
AppRegistry.registerComponent("Conversation", () => Conversation)
AppRegistry.registerComponent("Inquiry", () => Inquiry)
