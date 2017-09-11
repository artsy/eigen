import * as _ from "lodash"
import * as React from "react"
import { AppRegistry, ViewProperties } from "react-native"

import Consignments from "./Components/Consignments"
import LoadFailureView from "./Components/LoadFailureView"
import Spinner from "./Components/Spinner"
import Containers from "./Containers/index"

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

interface Props extends ViewProperties {
  trigger1pxScrollHack?: boolean
}

const renderWithLoadProgress = (Component: React.ReactType, initialProps: object = {}): RenderCallback => {
  let retrying = false
  return ({ error, props, retry }) => {
    if (error) {
      if (retrying) {
        retrying = false
        // TODO: Even though this code path is reached, the retry button keeps spinning. iirc it _should_ disappear when
        //      `onRetry` on the instance is unset.
        //
        // This will re-use the native view first created in the renderFailure callback, which means it can
        // continue its ‘retry’ animation.
        return <LoadFailureView style={{ flex: 1 }} />
      } else {
        retrying = true
        return <LoadFailureView onRetry={retry} style={{ flex: 1 }} />
      }
    } else if (props) {
      return <Component {...initialProps} {...props as any} />
    } else {
      return <Spinner style={{ flex: 1 }} />
    }
  }
}

const Artist: React.SFC<{ artistID: string; isPad: boolean }> = props =>
  <ArtistRenderer {...props} render={renderWithLoadProgress(Containers.Artist, props)} />

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

const MyAccount: React.SFC<{}> = () => <MyAccountRenderer render={renderWithLoadProgress(Containers.MyAccount)} />

AppRegistry.registerComponent("Consignments", () => Consignments)
AppRegistry.registerComponent("Artist", () => Artist)
AppRegistry.registerComponent("Home", () => Home)
AppRegistry.registerComponent("Gene", () => Gene)
AppRegistry.registerComponent("WorksForYou", () => WorksForYou)
AppRegistry.registerComponent("MyAccount", () => MyAccount)
AppRegistry.registerComponent("Inbox", () => Inbox)
AppRegistry.registerComponent("Conversation", () => Conversation)
AppRegistry.registerComponent("Inquiry", () => Inquiry)
