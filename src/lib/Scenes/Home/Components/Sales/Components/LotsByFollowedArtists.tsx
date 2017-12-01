import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import Spinner from "lib/Components/Spinner"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import { get, once } from "lodash"
import PropTypes from "prop-types"
import React, { Component } from "react"
import { FlatList, ScrollView, Text, View } from "react-native"
import { RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"
import { SectionHeader } from "./SectionHeader"

const DEFAULT_TITLE = "Lots by Artists You Follow"
export const PAGE_SIZE = 10

const Container = styled.View`padding: 10px;`

interface Props {
  relay?: RelayPaginationProp
  title?: string
  saleArtworks?: {
    edges: Array<{
      node: object | null
    }> | null
  }
}

export function LotsByFollowedArtists(props: Props) {
  const { relay, saleArtworks, title = DEFAULT_TITLE } = props

  const artworks = get(saleArtworks, "edges", []).filter(({ node }) => node.is_biddable).map(({ node }) => node.artwork)

  if (!artworks.length) {
    return null
  }

  const loadMore =
    relay.hasMore() &&
    once(() => {
      relay.loadMore(PAGE_SIZE, x => x)
    })

  return (
    <ScrollView onScroll={isCloseToBottom(loadMore)} scrollEventThrottle={400}>
      <SectionHeader title={title} />
      <Container>
        <GenericGrid artworks={artworks} />
        {relay.isLoading() && <Spinner style={{ marginTop: 20 }} />}
      </Container>
    </ScrollView>
  )
}
