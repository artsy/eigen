import React from "react"
import { AppRegistry, View } from "react-native"
import { RelayContainer } from "react-relay"

import Consignments from "./Components/Consignments"
import Containers from "./Containers/"
import BidFlow from "./Containers/BidFlow"
import RegistrationFlow from "./Containers/RegistrationFlow"
import {
  ArtistRenderer,
  BidderFlowRendererProps,
  BidFlowRenderer,
  ConversationRenderer,
  FairRenderer,
  GeneRenderer,
  InboxRenderer,
  InquiryRenderer,
  MyProfileRenderer,
  RegistrationFlowRenderer,
  ShowRenderer,
  WorksForYouRenderer,
} from "./relay/QueryRenderers"
import { CityView } from "./Scenes/City"
import { FairBoothRenderer } from "./Scenes/Fair/Screens/FairBooth"
import FavoritesScene from "./Scenes/Favorites"
import HomeScene from "./Scenes/Home"
import { MapContainer } from "./Scenes/Map"
import renderWithLoadProgress from "./utils/renderWithLoadProgress"
import { Schema, screenTrack as track } from "./utils/track"

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

const Inbox: React.SFC<{}> = track<{}>(() => {
  return { context_screen: Schema.PageNames.InboxPage, context_screen_owner_type: null }
})(props => <InboxRenderer {...props} render={renderWithLoadProgress(Containers.Inbox, props)} />)

interface GeneProps {
  geneID: string
  refineSettings: { medium: string; price_range: string }
}

const Gene: React.SFC<GeneProps> = track<GeneProps>(props => {
  return {
    context_screen: Schema.PageNames.GenePage,
    context_screen_owner_slug: props.geneID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
  }
})(({ geneID, refineSettings: { medium, price_range } }) => {
  const initialProps = { geneID, medium, price_range }
  return <GeneRenderer {...initialProps} render={renderWithLoadProgress(Containers.Gene, initialProps)} />
})

// FIXME: This isn't being used
// const Sale: React.SFC<{ saleID: string }> = ({ saleID }) => {
//   const initialProps = { saleID }
//   return <SaleRenderer {...initialProps} render={renderWithLoadProgress(Containers.Sale, initialProps)} />
// }

// TODO: This was required to trigger the 1px wake-up hack (in case the scrollview goes blank)
//
//     this.renderFetched = data => <Containers.WorksForYou {...data} trigger1pxScrollHack={this.props.trigger1pxScrollHack} />
const WorksForYou: React.SFC<{ selectedArtist: string }> = props => (
  <WorksForYouRenderer {...props} render={renderWithLoadProgress(Containers.WorksForYou, props)} />
)

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

/*
 * Route bid/register requests coming from the Emission pod to either a BidFlow
 * or RegisterFlow component with an appropriate query renderer
 */
type BidderFlowIntent = "bid" | "register"
interface BidderFlowProps {
  artworkID?: string
  saleID: string
  intent: BidderFlowIntent
}

interface BidderFlow {
  queryRenderer: React.ComponentType<BidderFlowRendererProps>
  container: RelayContainer<any>
}

const BidderFlows: { [BidderFlowIntent: string]: BidderFlow } = {
  bid: {
    queryRenderer: BidFlowRenderer,
    container: BidFlow,
  },
  register: {
    queryRenderer: RegistrationFlowRenderer,
    container: RegistrationFlow,
  },
}

const BidderFlow: React.SFC<BidderFlowProps> = ({ intent, ...restProps }) => {
  const { queryRenderer: Renderer, container: Container } = BidderFlows[intent]
  return <Renderer {...restProps} render={renderWithLoadProgress(Container)} />
}

interface FairProps {
  fairID: string
}

const Fair: React.SFC<FairProps> = track<FairProps>(props => {
  return {
    context_screen: Schema.PageNames.FairPage,
    context_screen_owner_slug: props.fairID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
  }
})(({ fairID }) => {
  return <FairRenderer fairID={fairID} render={renderWithLoadProgress(Containers.Fair, { fairID })} />
})

interface ShowProps {
  showID: string
}

const Show: React.SFC<ShowProps> = track<ShowProps>(props => {
  return {
    context_screen: Schema.PageNames.ShowPage,
    context_screen_owner_slug: props.showID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Show,
  }
})(({ showID }) => {
  return <ShowRenderer showID={showID} render={renderWithLoadProgress(Containers.Show, { showID })} />
})

interface FairBoothProps {
  fairBoothID: string
}

const FairBooth: React.SFC<FairBoothProps> = track<FairBoothProps>(props => {
  return {
    context_screen: Schema.PageNames.ShowPage,
    context_screen_owner_slug: props.fairBoothID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Show,
  }
})(({ fairBoothID }) => {
  return <FairBoothRenderer showID={fairBoothID} />
})

AppRegistry.registerComponent("Consignments", () => Consignments)
AppRegistry.registerComponent("Artist", () => Artist)
AppRegistry.registerComponent("Home", () => HomeScene)
AppRegistry.registerComponent("Gene", () => Gene)
AppRegistry.registerComponent("WorksForYou", () => WorksForYou)
AppRegistry.registerComponent("MyProfile", () => MyProfile)
AppRegistry.registerComponent("MySellingProfile", () => () => <View />)
AppRegistry.registerComponent("MyProfileEdit", () => () => <View />)
AppRegistry.registerComponent("Inbox", () => Inbox)
AppRegistry.registerComponent("Conversation", () => Conversation)
AppRegistry.registerComponent("Inquiry", () => Inquiry)
AppRegistry.registerComponent("Favorites", () => FavoritesScene)
// TODO: Change everything to BidderFlow? AuctionAction?
AppRegistry.registerComponent("BidFlow", () => BidderFlow)
AppRegistry.registerComponent("Fair", () => Fair)
AppRegistry.registerComponent("FairBooth", () => FairBooth)
AppRegistry.registerComponent("Show", () => Show)
AppRegistry.registerComponent("Map", () => MapContainer)
AppRegistry.registerComponent("City", () => CityView)
