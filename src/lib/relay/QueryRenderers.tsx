import * as React from "react"
import { graphql, QueryRenderer, QueryRendererProps } from "react-relay"

// tslint:disable:no-unused-expression
import Artist from "../Containers/Artist"
Artist

import Conversation from "../Containers/Conversation"
Conversation

import Home from "../Containers/Home"
Home

import Gene from "../Containers/Gene"
Gene

import WorksForYou from "../Containers/WorksForYou"
WorksForYou

import Inquiry from "../Containers/Inquiry"
Inquiry

import MyAccount from "../Containers/MyAccount"
MyAccount

import Inbox from "../Containers/Inbox"
Inbox
// tslint:enable:no-unused-expression

import createEnvironment from "./createEnvironment"
const environment = createEnvironment()

export type RenderCallback = QueryRendererProps["render"]

interface RendererProps {
  render: RenderCallback
}

interface ArtistRendererProps extends RendererProps {
  artistID: string
  isPad: boolean
}

export const ArtistRenderer: React.SFC<ArtistRendererProps> = ({ render, artistID, isPad }) => {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
        query QueryRenderersArtistQuery($artistID: String!, $isPad: Boolean!) {
          artist(id: $artistID) {
            ...Artist_artist
          }
        }
      `}
      variables={{ artistID, isPad }}
      render={render}
    />
  )
}

interface ConversationRendererProps extends RendererProps {
  conversationID: string
  cursor?: string
  count?: number
}

export const ConversationRenderer: React.SFC<ConversationRendererProps> = ({ render, conversationID }) => {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql.experimental`
        query QueryRenderersConversationQuery($conversationID: String!) {
          me {
            ...Conversation_me
          }
        }
      `}
      variables={{
        conversationID,
        count: 10,
      }}
      render={render}
    />
  )
}

export const HomeRenderer: React.SFC<RendererProps> = ({ render }) => {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
        query QueryRenderersHomeQuery {
          home: home_page {
            ...Home_home
          }
        }
      `}
      variables={{}}
      render={render}
    />
  )
}

interface GeneRendererProps extends RendererProps {
  geneID: string
  medium?: string
  price_range?: string
}

export const GeneRenderer: React.SFC<GeneRendererProps> = ({ render, geneID, medium, price_range }) => {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
        query QueryRenderersGeneQuery($geneID: String!) {
          gene(id: $geneID) {
            ...Gene_gene
          }
        }
      `}
      variables={{
        geneID,
        medium,
        price_range,
      }}
      render={render}
    />
  )
}

interface WorksForYouRendererProps extends RendererProps {
  selectedArtist?: string
}

export const WorksForYouRenderer: React.SFC<WorksForYouRendererProps> = ({ render, selectedArtist }) => {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql.experimental`
        query QueryRenderersWorksForYouQuery($selectedArtist: String!) {
          viewer {
            ...WorksForYou_viewer @arguments(selectedArtist: $selectedArtist)
          }
        }
      `}
      variables={{
        selectedArtist: selectedArtist || "",
      }}
      render={render}
    />
  )
}

interface InquiryRendererProps extends RendererProps {
  artworkID: string
}

export const InquiryRenderer: React.SFC<InquiryRendererProps> = ({ render, artworkID }) => {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
        query QueryRenderersInquiryQuery($artworkID: String!) {
          artwork(id: $artworkID) {
            ...Inquiry_artwork
          }
        }
      `}
      variables={{
        artworkID,
      }}
      render={render}
    />
  )
}

export const InboxRenderer: React.SFC<RendererProps> = ({ render }) => {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
        query QueryRenderersInboxQuery {
          me {
            ...Inbox_me
          }
        }
      `}
      variables={{}}
      render={render}
    />
  )
}

export const MyAccountRenderer: React.SFC<RendererProps> = ({ render }) => {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
        query QueryRenderersMyAccountQuery {
          me {
            ...MyAccount_me
          }
        }
      `}
      variables={{}}
      render={render}
    />
  )
}
