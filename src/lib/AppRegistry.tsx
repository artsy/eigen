import * as _ from "lodash"
import React from "react"
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
  MyProfileRenderer,
  RenderCallback,
  SaleRenderer,
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
  return {
    context_screen: Schema.PageNames.ArtistPage,
    context_screen_owner_slug: props.artistID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
  }
})(props => <ArtistRenderer {...props} render={renderWithLoadProgress(Containers.Artist, props)} />)

const Inbox: React.SFC<{}> = track<{}>(props => {
  return { context_screen: Schema.PageNames.InboxPage, context_screen_owner_type: null }
})(() => <InboxRenderer render={renderWithLoadProgress(Containers.Inbox)} />)

interface GeneProps {
  geneID: string
  refineSettings: { medium: string; price_range: string }
}

const Gene: React.SFC<GeneProps> = ({ geneID, refineSettings: { medium, price_range } }) => {
  const initialProps = { geneID, medium, price_range }
  return <GeneRenderer {...initialProps} render={renderWithLoadProgress(Containers.Gene, initialProps)} />
}

const Sale: React.SFC<{ saleID: string }> = ({ saleID }) => {
  const initialProps = { saleID }
  return <SaleRenderer {...initialProps} render={renderWithLoadProgress(Containers.Sale, initialProps)} />
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
  return {
    context_screen: Schema.PageNames.InquiryPage,
    context_screen_owner_slug: props.artworkID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
  }
})(props => <InquiryRenderer {...props} render={renderWithLoadProgress(Containers.Inquiry, props)} />)

interface ConversationProps {
  conversationID: string
}
const Conversation: React.SFC<ConversationProps> = track<ConversationProps>(props => {
  return {
    context_screen: Schema.PageNames.ConversationPage,
    context_screen_owner_id: props.conversationID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Conversation,
  }
})(props => <ConversationRenderer {...props} render={renderWithLoadProgress(Containers.Conversation, props)} />)

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
