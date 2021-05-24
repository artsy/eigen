import React, { createRef, RefObject, useEffect, useRef, useState } from "react"
import { Alert, Platform, RefreshControl, View, ViewProps } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"

import { ArtistRailFragmentContainer } from "lib/Components/Home/ArtistRails/ArtistRail"
import { ArtworkRailFragmentContainer } from "lib/Scenes/Home/Components/ArtworkRail"
import { CollectionsRailFragmentContainer } from "lib/Scenes/Home/Components/CollectionsRail"
import { EmailConfirmationBannerFragmentContainer } from "lib/Scenes/Home/Components/EmailConfirmationBanner"
import { FairsRailFragmentContainer } from "lib/Scenes/Home/Components/FairsRail"
import { SaleArtworksHomeRailContainer } from "lib/Scenes/Home/Components/SaleArtworksHomeRail"
import { SalesRailFragmentContainer } from "lib/Scenes/Home/Components/SalesRail"
import { ActionResultsRailFragmentContainer } from "lib/Scenes/Home/Components/AuctionResultsRail"

import { Home_homePage } from "__generated__/Home_homePage.graphql"
import { Home_me } from "__generated__/Home_me.graphql"
import { HomeQuery } from "__generated__/HomeQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { compact, drop, flatten, times, zip } from "lodash"
import { ArtsyLogoIcon, Box, Flex, Join, Spacer, Theme } from "palette"

import { Home_featured } from "__generated__/Home_featured.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { GlobalStore, useFeatureFlag } from "lib/store/GlobalStore"
import { isPad } from "lib/utils/hardware"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { ViewingRoomsHomeRail } from "../ViewingRoom/Components/ViewingRoomsHomeRail"
import { HomeHeroContainer } from "./Components/HomeHero"
import { RailScrollRef } from "./Components/types"

const mockResults = {
  __fragments: {
    AuctionResultsRail_collectionsModule: {},
  },
  __id: "client:root:homePage:marketingCollectionsModule",
  __fragmentOwner: {
    identifier: '18cec0e017c37c801346e52c4f931a9e{"heroImageVersion":"NARROW"}',
    node: {
      fragment: {
        argumentDefinitions: [
          {
            defaultValue: null,
            kind: "LocalArgument",
            name: "heroImageVersion",
          },
        ],
        kind: "Fragment",
        metadata: null,
        name: "HomeQuery",
        selections: [
          {
            alias: null,
            args: null,
            concreteType: "HomePage",
            kind: "LinkedField",
            name: "homePage",
            plural: false,
            selections: [
              {
                args: [
                  {
                    kind: "Variable",
                    name: "heroImageVersion",
                    variableName: "heroImageVersion",
                  },
                ],
                kind: "FragmentSpread",
                name: "Home_homePage",
              },
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "Me",
            kind: "LinkedField",
            name: "me",
            plural: false,
            selections: [
              {
                args: null,
                kind: "FragmentSpread",
                name: "Home_me",
              },
            ],
            storageKey: null,
          },
          {
            alias: "featured",
            args: [
              {
                kind: "Literal",
                name: "featured",
                value: true,
              },
            ],
            concreteType: "ViewingRoomConnection",
            kind: "LinkedField",
            name: "viewingRooms",
            plural: false,
            selections: [
              {
                args: null,
                kind: "FragmentSpread",
                name: "Home_featured",
              },
            ],
            storageKey: "viewingRooms(featured:true)",
          },
        ],
        type: "Query",
        abstractKey: null,
      },
      kind: "Request",
      operation: {
        argumentDefinitions: [
          {
            defaultValue: null,
            kind: "LocalArgument",
            name: "heroImageVersion",
          },
        ],
        kind: "Operation",
        name: "HomeQuery",
        selections: [
          {
            alias: null,
            args: null,
            concreteType: "HomePage",
            kind: "LinkedField",
            name: "homePage",
            plural: false,
            selections: [
              {
                alias: null,
                args: [
                  {
                    kind: "Literal",
                    name: "exclude",
                    value: [
                      "SAVED_WORKS",
                      "GENERIC_GENES",
                      "LIVE_AUCTIONS",
                      "CURRENT_FAIRS",
                      "RELATED_ARTISTS",
                      "FOLLOWED_GENES",
                    ],
                  },
                  {
                    kind: "Literal",
                    name: "maxFollowedGeneRails",
                    value: -1,
                  },
                  {
                    kind: "Literal",
                    name: "maxRails",
                    value: -1,
                  },
                  {
                    kind: "Literal",
                    name: "order",
                    value: [
                      "ACTIVE_BIDS",
                      "FOLLOWED_ARTISTS",
                      "RECENTLY_VIEWED_WORKS",
                      "RECOMMENDED_WORKS",
                      "FOLLOWED_GALLERIES",
                    ],
                  },
                ],
                concreteType: "HomePageArtworkModule",
                kind: "LinkedField",
                name: "artworkModules",
                plural: true,
                selections: [
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "id",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "title",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "key",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    concreteType: "Artwork",
                    kind: "LinkedField",
                    name: "results",
                    plural: true,
                    selections: [
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "href",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "saleMessage",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "artistNames",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "slug",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "internalID",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        concreteType: "Sale",
                        kind: "LinkedField",
                        name: "sale",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "isAuction",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "isClosed",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "displayTimelyAt",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "endAt",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "id",
                            storageKey: null,
                          },
                        ],
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        concreteType: "SaleArtwork",
                        kind: "LinkedField",
                        name: "saleArtwork",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            concreteType: "SaleArtworkCounts",
                            kind: "LinkedField",
                            name: "counts",
                            plural: false,
                            selections: [
                              {
                                alias: null,
                                args: null,
                                kind: "ScalarField",
                                name: "bidderPositions",
                                storageKey: null,
                              },
                            ],
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            concreteType: "SaleArtworkCurrentBid",
                            kind: "LinkedField",
                            name: "currentBid",
                            plural: false,
                            selections: [
                              {
                                alias: null,
                                args: null,
                                kind: "ScalarField",
                                name: "display",
                                storageKey: null,
                              },
                            ],
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "id",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "lotLabel",
                            storageKey: null,
                          },
                        ],
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        concreteType: "Partner",
                        kind: "LinkedField",
                        name: "partner",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "name",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "id",
                            storageKey: null,
                          },
                        ],
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        concreteType: "Image",
                        kind: "LinkedField",
                        name: "image",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "imageURL",
                            storageKey: null,
                          },
                          {
                            alias: "aspect_ratio",
                            args: null,
                            kind: "ScalarField",
                            name: "aspectRatio",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: [
                              {
                                kind: "Literal",
                                name: "version",
                                value: "large",
                              },
                            ],
                            kind: "ScalarField",
                            name: "url",
                            storageKey: 'url(version:"large")',
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "aspectRatio",
                            storageKey: null,
                          },
                        ],
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "id",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "title",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "date",
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    concreteType: null,
                    kind: "LinkedField",
                    name: "context",
                    plural: false,
                    selections: [
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "__typename",
                        storageKey: null,
                      },
                      {
                        kind: "InlineFragment",
                        selections: [
                          {
                            alias: null,
                            args: null,
                            concreteType: "Artist",
                            kind: "LinkedField",
                            name: "artist",
                            plural: false,
                            selections: [
                              {
                                alias: null,
                                args: null,
                                kind: "ScalarField",
                                name: "slug",
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                kind: "ScalarField",
                                name: "internalID",
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                kind: "ScalarField",
                                name: "href",
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                kind: "ScalarField",
                                name: "id",
                                storageKey: null,
                              },
                            ],
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            concreteType: "Artist",
                            kind: "LinkedField",
                            name: "basedOn",
                            plural: false,
                            selections: [
                              {
                                alias: null,
                                args: null,
                                kind: "ScalarField",
                                name: "name",
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                kind: "ScalarField",
                                name: "id",
                                storageKey: null,
                              },
                            ],
                            storageKey: null,
                          },
                        ],
                        type: "HomePageRelatedArtistArtworkModule",
                        abstractKey: null,
                      },
                      {
                        kind: "InlineFragment",
                        selections: [
                          {
                            alias: null,
                            args: null,
                            concreteType: "Artist",
                            kind: "LinkedField",
                            name: "artist",
                            plural: false,
                            selections: [
                              {
                                alias: null,
                                args: null,
                                kind: "ScalarField",
                                name: "href",
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                kind: "ScalarField",
                                name: "id",
                                storageKey: null,
                              },
                            ],
                            storageKey: null,
                          },
                        ],
                        type: "HomePageFollowedArtistArtworkModule",
                        abstractKey: null,
                      },
                      {
                        kind: "InlineFragment",
                        selections: [
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "href",
                            storageKey: null,
                          },
                        ],
                        type: "Fair",
                        abstractKey: null,
                      },
                      {
                        kind: "InlineFragment",
                        selections: [
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "href",
                            storageKey: null,
                          },
                        ],
                        type: "Gene",
                        abstractKey: null,
                      },
                      {
                        kind: "InlineFragment",
                        selections: [
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "href",
                            storageKey: null,
                          },
                        ],
                        type: "Sale",
                        abstractKey: null,
                      },
                      {
                        kind: "InlineFragment",
                        selections: [
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "id",
                            storageKey: null,
                          },
                        ],
                        type: "Node",
                        abstractKey: "__isNode",
                      },
                    ],
                    storageKey: null,
                  },
                ],
                storageKey:
                  'artworkModules(exclude:["SAVED_WORKS","GENERIC_GENES","LIVE_AUCTIONS","CURRENT_FAIRS","RELATED_ARTISTS","FOLLOWED_GENES"],maxFollowedGeneRails:-1,maxRails:-1,order:["ACTIVE_BIDS","FOLLOWED_ARTISTS","RECENTLY_VIEWED_WORKS","RECOMMENDED_WORKS","FOLLOWED_GALLERIES"])',
              },
              {
                alias: null,
                args: null,
                concreteType: "HomePageArtistModule",
                kind: "LinkedField",
                name: "artistModules",
                plural: true,
                selections: [
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "id",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "key",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    concreteType: "Artist",
                    kind: "LinkedField",
                    name: "results",
                    plural: true,
                    selections: [
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "id",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "slug",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "internalID",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "href",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "name",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "formattedNationalityAndBirthday",
                        storageKey: null,
                      },
                      {
                        alias: "avatar",
                        args: null,
                        concreteType: "Image",
                        kind: "LinkedField",
                        name: "image",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: [
                              {
                                kind: "Literal",
                                name: "version",
                                value: "small",
                              },
                            ],
                            kind: "ScalarField",
                            name: "url",
                            storageKey: 'url(version:"small")',
                          },
                        ],
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        concreteType: "Artist",
                        kind: "LinkedField",
                        name: "basedOn",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "name",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "id",
                            storageKey: null,
                          },
                        ],
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "isFollowed",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: [
                          {
                            kind: "Literal",
                            name: "first",
                            value: 3,
                          },
                        ],
                        concreteType: "ArtworkConnection",
                        kind: "LinkedField",
                        name: "artworksConnection",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            concreteType: "ArtworkEdge",
                            kind: "LinkedField",
                            name: "edges",
                            plural: true,
                            selections: [
                              {
                                alias: null,
                                args: null,
                                concreteType: "Artwork",
                                kind: "LinkedField",
                                name: "node",
                                plural: false,
                                selections: [
                                  {
                                    alias: null,
                                    args: null,
                                    concreteType: "Image",
                                    kind: "LinkedField",
                                    name: "image",
                                    plural: false,
                                    selections: [
                                      {
                                        alias: null,
                                        args: [
                                          {
                                            kind: "Literal",
                                            name: "version",
                                            value: "large",
                                          },
                                        ],
                                        kind: "ScalarField",
                                        name: "url",
                                        storageKey: 'url(version:"large")',
                                      },
                                    ],
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "id",
                                    storageKey: null,
                                  },
                                ],
                                storageKey: null,
                              },
                            ],
                            storageKey: null,
                          },
                        ],
                        storageKey: "artworksConnection(first:3)",
                      },
                    ],
                    storageKey: null,
                  },
                ],
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "HomePageFairsModule",
                kind: "LinkedField",
                name: "fairsModule",
                plural: false,
                selections: [
                  {
                    alias: null,
                    args: null,
                    concreteType: "Fair",
                    kind: "LinkedField",
                    name: "results",
                    plural: true,
                    selections: [
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "id",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "internalID",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "slug",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        concreteType: "Profile",
                        kind: "LinkedField",
                        name: "profile",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "slug",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "id",
                            storageKey: null,
                          },
                        ],
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "name",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "exhibitionPeriod",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        concreteType: "Image",
                        kind: "LinkedField",
                        name: "image",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: [
                              {
                                kind: "Literal",
                                name: "version",
                                value: "large",
                              },
                            ],
                            kind: "ScalarField",
                            name: "url",
                            storageKey: 'url(version:"large")',
                          },
                        ],
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        concreteType: "Location",
                        kind: "LinkedField",
                        name: "location",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "city",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "country",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "id",
                            storageKey: null,
                          },
                        ],
                        storageKey: null,
                      },
                      {
                        alias: "followedArtistArtworks",
                        args: [
                          {
                            kind: "Literal",
                            name: "first",
                            value: 2,
                          },
                          {
                            kind: "Literal",
                            name: "input",
                            value: {
                              includeArtworksByFollowedArtists: true,
                            },
                          },
                        ],
                        concreteType: "FilterArtworksConnection",
                        kind: "LinkedField",
                        name: "filterArtworksConnection",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            concreteType: "FilterArtworksEdge",
                            kind: "LinkedField",
                            name: "edges",
                            plural: true,
                            selections: [
                              {
                                alias: null,
                                args: null,
                                concreteType: "Artwork",
                                kind: "LinkedField",
                                name: "node",
                                plural: false,
                                selections: [
                                  {
                                    alias: null,
                                    args: null,
                                    concreteType: "Image",
                                    kind: "LinkedField",
                                    name: "image",
                                    plural: false,
                                    selections: [
                                      {
                                        alias: null,
                                        args: [
                                          {
                                            kind: "Literal",
                                            name: "version",
                                            value: "large",
                                          },
                                        ],
                                        kind: "ScalarField",
                                        name: "url",
                                        storageKey: 'url(version:"large")',
                                      },
                                    ],
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "id",
                                    storageKey: null,
                                  },
                                ],
                                storageKey: null,
                              },
                            ],
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "id",
                            storageKey: null,
                          },
                        ],
                        storageKey: 'filterArtworksConnection(first:2,input:{"includeArtworksByFollowedArtists":true})',
                      },
                      {
                        alias: "otherArtworks",
                        args: [
                          {
                            kind: "Literal",
                            name: "first",
                            value: 2,
                          },
                        ],
                        concreteType: "FilterArtworksConnection",
                        kind: "LinkedField",
                        name: "filterArtworksConnection",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            concreteType: "FilterArtworksEdge",
                            kind: "LinkedField",
                            name: "edges",
                            plural: true,
                            selections: [
                              {
                                alias: null,
                                args: null,
                                concreteType: "Artwork",
                                kind: "LinkedField",
                                name: "node",
                                plural: false,
                                selections: [
                                  {
                                    alias: null,
                                    args: null,
                                    concreteType: "Image",
                                    kind: "LinkedField",
                                    name: "image",
                                    plural: false,
                                    selections: [
                                      {
                                        alias: null,
                                        args: [
                                          {
                                            kind: "Literal",
                                            name: "version",
                                            value: "large",
                                          },
                                        ],
                                        kind: "ScalarField",
                                        name: "url",
                                        storageKey: 'url(version:"large")',
                                      },
                                    ],
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "id",
                                    storageKey: null,
                                  },
                                ],
                                storageKey: null,
                              },
                            ],
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "id",
                            storageKey: null,
                          },
                        ],
                        storageKey: "filterArtworksConnection(first:2)",
                      },
                    ],
                    storageKey: null,
                  },
                ],
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "HomePageSalesModule",
                kind: "LinkedField",
                name: "salesModule",
                plural: false,
                selections: [
                  {
                    alias: null,
                    args: null,
                    concreteType: "Sale",
                    kind: "LinkedField",
                    name: "results",
                    plural: true,
                    selections: [
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "id",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "slug",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "internalID",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "href",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "name",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "liveURLIfOpen",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "liveStartAt",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "displayTimelyAt",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: [
                          {
                            kind: "Literal",
                            name: "first",
                            value: 3,
                          },
                        ],
                        concreteType: "SaleArtworkConnection",
                        kind: "LinkedField",
                        name: "saleArtworksConnection",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            concreteType: "SaleArtworkEdge",
                            kind: "LinkedField",
                            name: "edges",
                            plural: true,
                            selections: [
                              {
                                alias: null,
                                args: null,
                                concreteType: "SaleArtwork",
                                kind: "LinkedField",
                                name: "node",
                                plural: false,
                                selections: [
                                  {
                                    alias: null,
                                    args: null,
                                    concreteType: "Artwork",
                                    kind: "LinkedField",
                                    name: "artwork",
                                    plural: false,
                                    selections: [
                                      {
                                        alias: null,
                                        args: null,
                                        concreteType: "Image",
                                        kind: "LinkedField",
                                        name: "image",
                                        plural: false,
                                        selections: [
                                          {
                                            alias: null,
                                            args: [
                                              {
                                                kind: "Literal",
                                                name: "version",
                                                value: "large",
                                              },
                                            ],
                                            kind: "ScalarField",
                                            name: "url",
                                            storageKey: 'url(version:"large")',
                                          },
                                        ],
                                        storageKey: null,
                                      },
                                      {
                                        alias: null,
                                        args: null,
                                        kind: "ScalarField",
                                        name: "id",
                                        storageKey: null,
                                      },
                                    ],
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "id",
                                    storageKey: null,
                                  },
                                ],
                                storageKey: null,
                              },
                            ],
                            storageKey: null,
                          },
                        ],
                        storageKey: "saleArtworksConnection(first:3)",
                      },
                    ],
                    storageKey: null,
                  },
                ],
                storageKey: null,
              },
              {
                alias: null,
                args: null,
                concreteType: "HomePageMarketingCollectionsModule",
                kind: "LinkedField",
                name: "marketingCollectionsModule",
                plural: false,
                selections: [
                  {
                    alias: null,
                    args: null,
                    concreteType: "MarketingCollection",
                    kind: "LinkedField",
                    name: "results",
                    plural: true,
                    selections: [
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "title",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "slug",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: [
                          {
                            kind: "Literal",
                            name: "first",
                            value: 3,
                          },
                        ],
                        concreteType: "FilterArtworksConnection",
                        kind: "LinkedField",
                        name: "artworksConnection",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            concreteType: "FilterArtworksCounts",
                            kind: "LinkedField",
                            name: "counts",
                            plural: false,
                            selections: [
                              {
                                alias: null,
                                args: null,
                                kind: "ScalarField",
                                name: "total",
                                storageKey: null,
                              },
                            ],
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            concreteType: "FilterArtworksEdge",
                            kind: "LinkedField",
                            name: "edges",
                            plural: true,
                            selections: [
                              {
                                alias: null,
                                args: null,
                                concreteType: "Artwork",
                                kind: "LinkedField",
                                name: "node",
                                plural: false,
                                selections: [
                                  {
                                    alias: null,
                                    args: null,
                                    concreteType: "Image",
                                    kind: "LinkedField",
                                    name: "image",
                                    plural: false,
                                    selections: [
                                      {
                                        alias: null,
                                        args: [
                                          {
                                            kind: "Literal",
                                            name: "version",
                                            value: "large",
                                          },
                                        ],
                                        kind: "ScalarField",
                                        name: "url",
                                        storageKey: 'url(version:"large")',
                                      },
                                    ],
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "id",
                                    storageKey: null,
                                  },
                                ],
                                storageKey: null,
                              },
                            ],
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "id",
                            storageKey: null,
                          },
                        ],
                        storageKey: "artworksConnection(first:3)",
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "id",
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                ],
                storageKey: null,
              },
              {
                alias: null,
                args: [
                  {
                    kind: "Literal",
                    name: "platform",
                    value: "MOBILE",
                  },
                ],
                concreteType: "HomePageHeroUnit",
                kind: "LinkedField",
                name: "heroUnits",
                plural: true,
                selections: [
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "title",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "subtitle",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "creditLine",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "linkText",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "href",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: [
                      {
                        kind: "Variable",
                        name: "version",
                        variableName: "heroImageVersion",
                      },
                    ],
                    kind: "ScalarField",
                    name: "backgroundImageURL",
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    kind: "ScalarField",
                    name: "id",
                    storageKey: null,
                  },
                ],
                storageKey: 'heroUnits(platform:"MOBILE")',
              },
            ],
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            concreteType: "Me",
            kind: "LinkedField",
            name: "me",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "canRequestEmailConfirmation",
                storageKey: null,
              },
              {
                alias: null,
                args: [
                  {
                    kind: "Literal",
                    name: "first",
                    value: 6,
                  },
                  {
                    kind: "Literal",
                    name: "includeArtworksByFollowedArtists",
                    value: true,
                  },
                  {
                    kind: "Literal",
                    name: "isAuction",
                    value: true,
                  },
                  {
                    kind: "Literal",
                    name: "liveSale",
                    value: true,
                  },
                ],
                concreteType: "SaleArtworksConnection",
                kind: "LinkedField",
                name: "lotsByFollowedArtistsConnection",
                plural: false,
                selections: [
                  {
                    alias: null,
                    args: null,
                    concreteType: "PageInfo",
                    kind: "LinkedField",
                    name: "pageInfo",
                    plural: false,
                    selections: [
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "hasNextPage",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "startCursor",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "endCursor",
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                  {
                    alias: null,
                    args: null,
                    concreteType: "SaleArtwork",
                    kind: "LinkedField",
                    name: "edges",
                    plural: true,
                    selections: [
                      {
                        alias: null,
                        args: null,
                        concreteType: "Artwork",
                        kind: "LinkedField",
                        name: "node",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "id",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "href",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            concreteType: "SaleArtwork",
                            kind: "LinkedField",
                            name: "saleArtwork",
                            plural: false,
                            selections: [
                              {
                                alias: null,
                                args: null,
                                concreteType: "Artwork",
                                kind: "LinkedField",
                                name: "artwork",
                                plural: false,
                                selections: [
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "artistNames",
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "date",
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "href",
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    concreteType: "Image",
                                    kind: "LinkedField",
                                    name: "image",
                                    plural: false,
                                    selections: [
                                      {
                                        alias: "imageURL",
                                        args: [
                                          {
                                            kind: "Literal",
                                            name: "version",
                                            value: "small",
                                          },
                                        ],
                                        kind: "ScalarField",
                                        name: "url",
                                        storageKey: 'url(version:"small")',
                                      },
                                      {
                                        alias: null,
                                        args: null,
                                        kind: "ScalarField",
                                        name: "aspectRatio",
                                        storageKey: null,
                                      },
                                    ],
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "internalID",
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "slug",
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "saleMessage",
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "title",
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "id",
                                    storageKey: null,
                                  },
                                ],
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                concreteType: "SaleArtworkCounts",
                                kind: "LinkedField",
                                name: "counts",
                                plural: false,
                                selections: [
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "bidderPositions",
                                    storageKey: null,
                                  },
                                ],
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                concreteType: "SaleArtworkCurrentBid",
                                kind: "LinkedField",
                                name: "currentBid",
                                plural: false,
                                selections: [
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "display",
                                    storageKey: null,
                                  },
                                ],
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                kind: "ScalarField",
                                name: "lotLabel",
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                concreteType: "Sale",
                                kind: "LinkedField",
                                name: "sale",
                                plural: false,
                                selections: [
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "isAuction",
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "isClosed",
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "displayTimelyAt",
                                    storageKey: null,
                                  },
                                  {
                                    alias: null,
                                    args: null,
                                    kind: "ScalarField",
                                    name: "id",
                                    storageKey: null,
                                  },
                                ],
                                storageKey: null,
                              },
                              {
                                alias: null,
                                args: null,
                                kind: "ScalarField",
                                name: "id",
                                storageKey: null,
                              },
                            ],
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "__typename",
                            storageKey: null,
                          },
                        ],
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "cursor",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "id",
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                ],
                storageKey:
                  "lotsByFollowedArtistsConnection(first:6,includeArtworksByFollowedArtists:true,isAuction:true,liveSale:true)",
              },
              {
                alias: null,
                args: [
                  {
                    kind: "Literal",
                    name: "first",
                    value: 6,
                  },
                  {
                    kind: "Literal",
                    name: "includeArtworksByFollowedArtists",
                    value: true,
                  },
                  {
                    kind: "Literal",
                    name: "isAuction",
                    value: true,
                  },
                  {
                    kind: "Literal",
                    name: "liveSale",
                    value: true,
                  },
                ],
                filters: ["includeArtworksByFollowedArtists", "isAuction", "liveSale"],
                handle: "connection",
                key: "SaleArtworksHomeRail_lotsByFollowedArtistsConnection",
                kind: "LinkedHandle",
                name: "lotsByFollowedArtistsConnection",
              },
              {
                alias: null,
                args: null,
                kind: "ScalarField",
                name: "id",
                storageKey: null,
              },
            ],
            storageKey: null,
          },
          {
            alias: "featured",
            args: [
              {
                kind: "Literal",
                name: "featured",
                value: true,
              },
            ],
            concreteType: "ViewingRoomConnection",
            kind: "LinkedField",
            name: "viewingRooms",
            plural: false,
            selections: [
              {
                alias: null,
                args: null,
                concreteType: "ViewingRoomEdge",
                kind: "LinkedField",
                name: "edges",
                plural: true,
                selections: [
                  {
                    alias: null,
                    args: null,
                    concreteType: "ViewingRoom",
                    kind: "LinkedField",
                    name: "node",
                    plural: false,
                    selections: [
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "internalID",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "title",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "slug",
                        storageKey: null,
                      },
                      {
                        alias: "heroImage",
                        args: null,
                        concreteType: "ARImage",
                        kind: "LinkedField",
                        name: "image",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            concreteType: "ImageURLs",
                            kind: "LinkedField",
                            name: "imageURLs",
                            plural: false,
                            selections: [
                              {
                                alias: null,
                                args: null,
                                kind: "ScalarField",
                                name: "normalized",
                                storageKey: null,
                              },
                            ],
                            storageKey: null,
                          },
                        ],
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: null,
                        kind: "ScalarField",
                        name: "status",
                        storageKey: null,
                      },
                      {
                        alias: null,
                        args: [
                          {
                            kind: "Literal",
                            name: "short",
                            value: true,
                          },
                        ],
                        kind: "ScalarField",
                        name: "distanceToOpen",
                        storageKey: "distanceToOpen(short:true)",
                      },
                      {
                        alias: null,
                        args: [
                          {
                            kind: "Literal",
                            name: "short",
                            value: true,
                          },
                        ],
                        kind: "ScalarField",
                        name: "distanceToClose",
                        storageKey: "distanceToClose(short:true)",
                      },
                      {
                        alias: null,
                        args: null,
                        concreteType: "Partner",
                        kind: "LinkedField",
                        name: "partner",
                        plural: false,
                        selections: [
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "name",
                            storageKey: null,
                          },
                          {
                            alias: null,
                            args: null,
                            kind: "ScalarField",
                            name: "id",
                            storageKey: null,
                          },
                        ],
                        storageKey: null,
                      },
                    ],
                    storageKey: null,
                  },
                ],
                storageKey: null,
              },
            ],
            storageKey: "viewingRooms(featured:true)",
          },
        ],
      },
      params: {
        id: "18cec0e017c37c801346e52c4f931a9e",
        metadata: {},
        name: "HomeQuery",
        operationKind: "query",
        text:
          'query HomeQuery(\n  $heroImageVersion: HomePageHeroUnitImageVersion\n) {\n  homePage {\n    ...Home_homePage_1IwJ0h\n  }\n  me {\n    ...Home_me\n    id\n  }\n  featured: viewingRooms(featured: true) {\n    ...Home_featured\n  }\n}\n\nfragment ArtistRail_rail on HomePageArtistModule {\n  id\n  key\n  results {\n    id\n    slug\n    internalID\n    href\n    name\n    formattedNationalityAndBirthday\n    avatar: image {\n      url(version: "small")\n    }\n    basedOn {\n      name\n      id\n    }\n    isFollowed\n    artworksConnection(first: 3) {\n      edges {\n        node {\n          image {\n            url(version: "large")\n          }\n          id\n        }\n      }\n    }\n  }\n}\n\nfragment ArtworkGridItem_artwork on Artwork {\n  title\n  date\n  saleMessage\n  slug\n  internalID\n  artistNames\n  href\n  sale {\n    isAuction\n    isClosed\n    displayTimelyAt\n    endAt\n    id\n  }\n  saleArtwork {\n    counts {\n      bidderPositions\n    }\n    currentBid {\n      display\n    }\n    lotLabel\n    id\n  }\n  partner {\n    name\n    id\n  }\n  image {\n    url(version: "large")\n    aspectRatio\n  }\n}\n\nfragment ArtworkRail_rail on HomePageArtworkModule {\n  title\n  key\n  results {\n    ...SmallTileRail_artworks\n    ...GenericGrid_artworks\n    id\n  }\n  context {\n    __typename\n    ... on HomePageRelatedArtistArtworkModule {\n      __typename\n      artist {\n        slug\n        internalID\n        href\n        id\n      }\n      basedOn {\n        name\n        id\n      }\n    }\n    ... on HomePageFollowedArtistArtworkModule {\n      artist {\n        href\n        id\n      }\n    }\n    ... on Fair {\n      href\n    }\n    ... on Gene {\n      href\n    }\n    ... on Sale {\n      href\n    }\n    ... on Node {\n      __isNode: __typename\n      id\n    }\n  }\n}\n\nfragment CollectionsRail_collectionsModule on HomePageMarketingCollectionsModule {\n  results {\n    title\n    slug\n    artworksConnection(first: 3) {\n      counts {\n        total\n      }\n      edges {\n        node {\n          image {\n            url(version: "large")\n          }\n          id\n        }\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment EmailConfirmationBanner_me on Me {\n  canRequestEmailConfirmation\n}\n\nfragment FairsRail_fairsModule on HomePageFairsModule {\n  results {\n    id\n    internalID\n    slug\n    profile {\n      slug\n      id\n    }\n    name\n    exhibitionPeriod\n    image {\n      url(version: "large")\n    }\n    location {\n      city\n      country\n      id\n    }\n    followedArtistArtworks: filterArtworksConnection(first: 2, input: {includeArtworksByFollowedArtists: true}) {\n      edges {\n        node {\n          image {\n            url(version: "large")\n          }\n          id\n        }\n      }\n      id\n    }\n    otherArtworks: filterArtworksConnection(first: 2) {\n      edges {\n        node {\n          image {\n            url(version: "large")\n          }\n          id\n        }\n      }\n      id\n    }\n  }\n}\n\nfragment GenericGrid_artworks on Artwork {\n  id\n  image {\n    aspect_ratio: aspectRatio\n  }\n  ...ArtworkGridItem_artwork\n}\n\nfragment HomeHero_homePage_1IwJ0h on HomePage {\n  heroUnits(platform: MOBILE) {\n    title\n    subtitle\n    creditLine\n    linkText\n    href\n    backgroundImageURL(version: $heroImageVersion)\n    id\n  }\n}\n\nfragment Home_featured on ViewingRoomConnection {\n  ...ViewingRoomsListFeatured_featured\n}\n\nfragment Home_homePage_1IwJ0h on HomePage {\n  artworkModules(maxRails: -1, maxFollowedGeneRails: -1, order: [ACTIVE_BIDS, FOLLOWED_ARTISTS, RECENTLY_VIEWED_WORKS, RECOMMENDED_WORKS, FOLLOWED_GALLERIES], exclude: [SAVED_WORKS, GENERIC_GENES, LIVE_AUCTIONS, CURRENT_FAIRS, RELATED_ARTISTS, FOLLOWED_GENES]) {\n    id\n    ...ArtworkRail_rail\n  }\n  artistModules {\n    id\n    ...ArtistRail_rail\n  }\n  fairsModule {\n    ...FairsRail_fairsModule\n  }\n  salesModule {\n    ...SalesRail_salesModule\n  }\n  marketingCollectionsModule {\n    ...CollectionsRail_collectionsModule\n  }\n  ...HomeHero_homePage_1IwJ0h\n}\n\nfragment Home_me on Me {\n  ...EmailConfirmationBanner_me\n  ...SaleArtworksHomeRail_me\n}\n\nfragment SaleArtworkTileRailCard_saleArtwork on SaleArtwork {\n  artwork {\n    artistNames\n    date\n    href\n    image {\n      imageURL: url(version: "small")\n      aspectRatio\n    }\n    internalID\n    slug\n    saleMessage\n    title\n    id\n  }\n  counts {\n    bidderPositions\n  }\n  currentBid {\n    display\n  }\n  lotLabel\n  sale {\n    isAuction\n    isClosed\n    displayTimelyAt\n    id\n  }\n}\n\nfragment SaleArtworksHomeRail_me on Me {\n  lotsByFollowedArtistsConnection(first: 6, includeArtworksByFollowedArtists: true, isAuction: true, liveSale: true) {\n    pageInfo {\n      hasNextPage\n      startCursor\n      endCursor\n    }\n    edges {\n      node {\n        id\n        href\n        saleArtwork {\n          ...SaleArtworkTileRailCard_saleArtwork\n          id\n        }\n        __typename\n      }\n      cursor\n      id\n    }\n  }\n}\n\nfragment SalesRail_salesModule on HomePageSalesModule {\n  results {\n    id\n    slug\n    internalID\n    href\n    name\n    liveURLIfOpen\n    liveStartAt\n    displayTimelyAt\n    saleArtworksConnection(first: 3) {\n      edges {\n        node {\n          artwork {\n            image {\n              url(version: "large")\n            }\n            id\n          }\n          id\n        }\n      }\n    }\n  }\n}\n\nfragment SmallTileRail_artworks on Artwork {\n  href\n  saleMessage\n  artistNames\n  slug\n  internalID\n  sale {\n    isAuction\n    isClosed\n    displayTimelyAt\n    endAt\n    id\n  }\n  saleArtwork {\n    counts {\n      bidderPositions\n    }\n    currentBid {\n      display\n    }\n    id\n  }\n  partner {\n    name\n    id\n  }\n  image {\n    imageURL\n  }\n}\n\nfragment ViewingRoomsListFeatured_featured on ViewingRoomConnection {\n  edges {\n    node {\n      internalID\n      title\n      slug\n      heroImage: image {\n        imageURLs {\n          normalized\n        }\n      }\n      status\n      distanceToOpen(short: true)\n      distanceToClose(short: true)\n      partner {\n        name\n        id\n      }\n    }\n  }\n}\n',
      },
      hash: "187ead7971b7a904f1729cd36df6036d",
    },
    variables: {
      heroImageVersion: "NARROW",
    },
  },
}

interface Props extends ViewProps {
  homePage: Home_homePage
  me: Home_me
  featured: Home_featured
  relay: RelayRefetchProp
}

const Home = (props: Props) => {
  const { homePage, me, featured } = props
  const artworkModules = homePage.artworkModules || []
  const salesModule = homePage.salesModule
  const collectionsModule = homePage.marketingCollectionsModule
  const artistModules = (homePage.artistModules && homePage.artistModules.concat()) || []
  const fairsModule = homePage.fairsModule
  const auctionResultsModule = mockResults //!!! FIX TYPE

  const artworkRails = artworkModules.map(
    (module) =>
      module &&
      ({
        type: "artwork",
        data: module,
      } as const)
  )
  const artistRails = artistModules.map(
    (module) =>
      module &&
      ({
        type: "artist",
        data: module,
      } as const)
  )

  const viewingRoomsEchoFlag = useFeatureFlag("AREnableViewingRooms")

  /*
  Ordering is defined in https://www.notion.so/artsy/App-Home-Screen-4841255ded3f47c9bcdb73185ee3f335.
  Please make sure to keep this page in sync with the home screen.
  */
  const rowData = compact([
    artworkRails[0],
    { type: "lotsByFollowedArtists" } as const,
    artworkRails[1],
    salesModule &&
      ({
        type: "sales",
        data: salesModule,
      } as const),
    !!viewingRoomsEchoFlag && ({ type: "viewing-rooms" } as const),
    fairsModule &&
      ({
        type: "fairs",
        data: fairsModule,
      } as const),
    collectionsModule &&
      ({
        type: "collections",
        data: collectionsModule,
      } as const),
    auctionResultsModule &&
      ({
        type: "auction-results",
        data: auctionResultsModule,
      } as const),
    ...flatten(zip(drop(artworkRails, 2), artistRails)),
  ])

  const scrollRefs = useRef<Array<RefObject<RailScrollRef>>>(rowData.map((_) => createRef()))
  const scrollRailsToTop = () => scrollRefs.current.forEach((r) => r.current?.scrollToTop())

  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = async () => {
    setIsRefreshing(true)

    props.relay.refetch(
      { heroImageVersion: isPad() ? "WIDE" : "NARROW" },
      {},
      (error) => {
        if (error) {
          console.error("Home.tsx - Error refreshing ForYou rails:", error.message)
        }
        setIsRefreshing(false)
        scrollRailsToTop()
      },
      { force: true }
    )
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.Home,
        context_screen_owner_type: null as any,
      }}
    >
      <Theme>
        <View style={{ flex: 1 }}>
          <AboveTheFoldFlatList
            data={rowData}
            initialNumToRender={5}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
            renderItem={({ item, index, separators }) => {
              switch (item.type) {
                case "artwork":
                  return <ArtworkRailFragmentContainer rail={item.data} scrollRef={scrollRefs.current[index]} />
                case "artist":
                  return <ArtistRailFragmentContainer rail={item.data} scrollRef={scrollRefs.current[index]} />
                case "fairs":
                  return <FairsRailFragmentContainer fairsModule={item.data} scrollRef={scrollRefs.current[index]} />
                case "sales":
                  return <SalesRailFragmentContainer salesModule={item.data} scrollRef={scrollRefs.current[index]} />
                case "collections":
                  return (
                    <CollectionsRailFragmentContainer
                      collectionsModule={item.data}
                      scrollRef={scrollRefs.current[index]}
                    />
                  )
                case "viewing-rooms":
                  return <ViewingRoomsHomeRail featured={featured} />

                case "auction-results":
                  return (
                    <ActionResultsRailFragmentContainer
                      collectionsModule={item.data}
                      scrollRef={scrollRefs.current[index]}
                    />
                  )
                case "lotsByFollowedArtists":
                  return (
                    <SaleArtworksHomeRailContainer
                      me={me}
                      onShow={() => separators.updateProps("leading", { hideSeparator: false })}
                      onHide={() => separators.updateProps("leading", { hideSeparator: true })}
                    />
                  )
              }
            }}
            ListHeaderComponent={
              <Box mb={1} mt={2}>
                <Flex alignItems="center">
                  <ArtsyLogoIcon scale={0.75} />
                </Flex>
                <Spacer mb="15px" />
                <HomeHeroContainer homePage={homePage} />
                <Spacer mb="2" />
              </Box>
            }
            ItemSeparatorComponent={({ hideSeparator }) => (!hideSeparator ? <Spacer mb={3} /> : null)}
            ListFooterComponent={() => <Spacer mb={3} />}
            keyExtractor={(_item, index) => String(index)}
          />
          <EmailConfirmationBannerFragmentContainer me={me} />
        </View>
      </Theme>
    </ProvideScreenTracking>
  )
}

export const HomeFragmentContainer = createRefetchContainer(
  Home,
  {
    homePage: graphql`
      fragment Home_homePage on HomePage
      @argumentDefinitions(heroImageVersion: { type: "HomePageHeroUnitImageVersion" }) {
        artworkModules(
          maxRails: -1
          maxFollowedGeneRails: -1
          order: [ACTIVE_BIDS, FOLLOWED_ARTISTS, RECENTLY_VIEWED_WORKS, RECOMMENDED_WORKS, FOLLOWED_GALLERIES]
          # LIVE_AUCTIONS and CURRENT_FAIRS both have their own modules, below.
          exclude: [SAVED_WORKS, GENERIC_GENES, LIVE_AUCTIONS, CURRENT_FAIRS, RELATED_ARTISTS, FOLLOWED_GENES]
        ) {
          id
          ...ArtworkRail_rail
        }
        artistModules {
          id
          ...ArtistRail_rail
        }
        fairsModule {
          ...FairsRail_fairsModule
        }
        salesModule {
          ...SalesRail_salesModule
        }
        marketingCollectionsModule {
          ...CollectionsRail_collectionsModule
        }
        ...HomeHero_homePage @arguments(heroImageVersion: $heroImageVersion)
      }
    `,
    me: graphql`
      fragment Home_me on Me {
        ...EmailConfirmationBanner_me
        ...SaleArtworksHomeRail_me
      }
    `,
    featured: graphql`
      fragment Home_featured on ViewingRoomConnection {
        ...ViewingRoomsListFeatured_featured
      }
    `,
  },
  graphql`
    query HomeRefetchQuery($heroImageVersion: HomePageHeroUnitImageVersion!) {
      homePage {
        ...Home_homePage @arguments(heroImageVersion: $heroImageVersion)
      }
      me {
        ...Home_me
      }
      featured: viewingRooms(featured: true) {
        ...Home_featured
      }
    }
  `
)

const HomePlaceholder: React.FC<{}> = () => {
  // We use Math.random() here instead of PlaceholderRaggedText because its random
  // length is too deterministic, and we don't have any snapshot tests to worry about.

  const viewingRoomsEchoFlag = useFeatureFlag("AREnableViewingRooms")

  return (
    <Theme>
      <Flex>
        <Box mb={1} mt={2}>
          <Flex alignItems="center">
            <ArtsyLogoIcon scale={0.75} />
          </Flex>
        </Box>

        {
          // Small tiles to mimic the artwork rails
          times(2).map((r) => (
            <Box key={r} ml={2} mr={2}>
              <Spacer mb={3} />
              <PlaceholderText width={100 + Math.random() * 100} />
              <Flex flexDirection="row" mt={1}>
                <Join separator={<Spacer width={15} />}>
                  {times(3 + Math.random() * 10).map((index) => (
                    <Flex key={index}>
                      <PlaceholderBox height={120} width={120} />
                      <Spacer mb={2} />
                      <PlaceholderText width={120} />
                      <PlaceholderText width={30 + Math.random() * 60} />
                    </Flex>
                  ))}
                </Join>
                <Spacer mb={2} />
              </Flex>
            </Box>
          ))
        }

        {/* Larger tiles to mimic the fairs, sales, and collections rails */}
        <Box ml={2} mr={2}>
          <Spacer mb={3} />
          <PlaceholderText width={100 + Math.random() * 100} />
          <Flex flexDirection="row" mt={1}>
            <Join separator={<Spacer width={15} />}>
              {times(10).map((index) => (
                <PlaceholderBox key={index} height={270} width={270} />
              ))}
            </Join>
            <Spacer mb={2} />
          </Flex>
        </Box>

        {!!viewingRoomsEchoFlag && (
          <Flex ml="2" mt="3">
            <PlaceholderText width={100 + Math.random() * 100} marginBottom={20} />
            <Flex flexDirection="row">
              {times(4).map((i) => (
                <PlaceholderBox key={i} width={280} height={370} marginRight={15} />
              ))}
            </Flex>
          </Flex>
        )}
      </Flex>
    </Theme>
  )
}

const messages = {
  confirmed: {
    title: "Email Confirmed",
    message: "Your email has been confirmed.",
  },
  already_confirmed: {
    title: "Already Confirmed",
    message: "You have already confirmed your email.",
  },
  invalid_token: {
    title: "Error",
    message: "An error has occurred. Please contact supportartsy.net.",
  },
  blank_token: {
    title: "Error",
    message: "An error has occurred. Please contact supportartsy.net.",
  },
  expired_token: {
    title: "Link Expired",
    message: "Link expired. Please request a new verification email below.",
  },
}

export const HomeQueryRenderer: React.FC = () => {
  const { flash_message } = GlobalStore.useAppState((state) => state.bottomTabs.sessionState.tabProps.home ?? {}) as {
    flash_message?: string
  }

  const userAccessToken = GlobalStore.useAppState((store) =>
    Platform.OS === "ios" ? store.native.sessionState.authenticationToken : store.auth.userAccessToken
  )

  useEffect(() => {
    if (flash_message) {
      const message = messages[flash_message as keyof typeof messages]

      if (!message) {
        console.error(`Invalid flash_message type ${JSON.stringify(flash_message)}`)
        return
      }

      Alert.alert(message.title, message.message, [{ text: "Ok" }])
      // reset the tab props because we don't want this message to show again
      // if the home screen remounts for whatever reason.
      GlobalStore.actions.bottomTabs.setTabProps({ tab: "home", props: {} })
    }
  }, [flash_message])

  // Avoid rendering when user is logged out, it will fail anyway
  return userAccessToken ? (
    <QueryRenderer<HomeQuery>
      environment={defaultEnvironment}
      query={graphql`
        query HomeQuery($heroImageVersion: HomePageHeroUnitImageVersion) {
          homePage {
            ...Home_homePage @arguments(heroImageVersion: $heroImageVersion)
          }
          me {
            ...Home_me
          }
          featured: viewingRooms(featured: true) {
            ...Home_featured
          }
        }
      `}
      variables={{ heroImageVersion: isPad() ? "WIDE" : "NARROW" }}
      render={renderWithPlaceholder({ Container: HomeFragmentContainer, renderPlaceholder: () => <HomePlaceholder /> })}
      cacheConfig={{ force: true }}
    />
  ) : null
}
