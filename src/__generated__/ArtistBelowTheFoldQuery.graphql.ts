/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 186f42defc378934f11085ded50165d7 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistBelowTheFoldQueryVariables = {
    artistID: string;
    isPad: boolean;
};
export type ArtistBelowTheFoldQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistAbout_artist" | "ArtistShows_artist" | "ArtistInsights_artist">;
    } | null;
};
export type ArtistBelowTheFoldQuery = {
    readonly response: ArtistBelowTheFoldQueryResponse;
    readonly variables: ArtistBelowTheFoldQueryVariables;
};



/*
query ArtistBelowTheFoldQuery(
  $artistID: String!
  $isPad: Boolean!
) {
  artist(id: $artistID) {
    ...ArtistAbout_artist
    ...ArtistShows_artist
    ...ArtistInsights_artist
    id
  }
}

fragment Article_article on Article {
  thumbnail_title: thumbnailTitle
  href
  author {
    name
    id
  }
  thumbnail_image: thumbnailImage {
    url(version: "large")
  }
}

fragment Articles_articles on Article {
  id
  ...Article_article
}

fragment ArtistAboutShows_artist on Artist {
  name
  slug
  currentShows: showsConnection(status: "running", first: 10) {
    edges {
      node {
        id
        ...ArtistShow_show
      }
    }
  }
  upcomingShows: showsConnection(status: "upcoming", first: 10) {
    edges {
      node {
        id
        ...ArtistShow_show
      }
    }
  }
  pastShows: showsConnection(status: "closed", first: 3) {
    edges {
      node {
        id
        ...ArtistShow_show
      }
    }
  }
}

fragment ArtistAbout_artist on Artist {
  hasMetadata
  isDisplayAuctionLink
  slug
  ...Biography_artist
  ...ArtistConsignButton_artist
  ...ArtistAboutShows_artist
  related {
    artists: artistsConnection(first: 16) {
      edges {
        node {
          ...RelatedArtists_artists
          id
        }
      }
    }
  }
  articles: articlesConnection(first: 10) {
    edges {
      node {
        ...Articles_articles
        id
      }
    }
  }
}

fragment ArtistConsignButton_artist on Artist {
  targetSupply {
    isInMicrofunnel
    isTargetSupply
  }
  internalID
  slug
  name
  image {
    cropped(width: 66, height: 66) {
      url
    }
  }
}

fragment ArtistInsightsAuctionResults_artist on Artist {
  birthday
  slug
  id
  internalID
  auctionResultsConnection(allowEmptyCreatedDates: true, earliestCreatedYear: 1000, first: 10, latestCreatedYear: 2050, sort: DATE_DESC) {
    createdYearRange {
      startAt
      endAt
    }
    totalCount
    edges {
      node {
        id
        internalID
        ...AuctionResult_auctionResult
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment ArtistInsights_artist on Artist {
  name
  id
  internalID
  slug
  ...ArtistInsightsAuctionResults_artist
}

fragment ArtistShow_show on Show {
  slug
  href
  is_fair_booth: isFairBooth
  cover_image: coverImage {
    url(version: "large")
  }
  ...Metadata_show
}

fragment ArtistShows_artist on Artist {
  currentShows: showsConnection(status: "running", first: 10) {
    edges {
      node {
        ...VariableSizeShowsList_shows
        id
      }
    }
  }
  upcomingShows: showsConnection(status: "upcoming", first: 10) {
    edges {
      node {
        ...VariableSizeShowsList_shows
        id
      }
    }
  }
  pastSmallShows: showsConnection(status: "closed", first: 20) @skip(if: $isPad) {
    edges {
      node {
        ...SmallList_shows
        id
      }
    }
  }
  pastLargeShows: showsConnection(status: "closed", first: 20) @include(if: $isPad) {
    edges {
      node {
        ...VariableSizeShowsList_shows
        id
      }
    }
  }
}

fragment AuctionResult_auctionResult on AuctionResult {
  currency
  dateText
  id
  internalID
  images {
    thumbnail {
      url(version: "square140")
      height
      width
      aspectRatio
    }
  }
  estimate {
    low
  }
  mediumText
  organization
  boughtIn
  performance {
    mid
  }
  priceRealized {
    display
    cents
  }
  saleDate
  title
}

fragment Biography_artist on Artist {
  bio
  blurb
}

fragment Metadata_show on Show {
  kind
  name
  exhibition_period: exhibitionPeriod
  status_update: statusUpdate
  status
  partner {
    __typename
    ... on Partner {
      name
    }
    ... on ExternalPartner {
      name
      id
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
  location {
    city
    id
  }
}

fragment RelatedArtist_artist on Artist {
  href
  name
  counts {
    forSaleArtworks
    artworks
  }
  image {
    url(version: "large")
  }
}

fragment RelatedArtists_artists on Artist {
  id
  ...RelatedArtist_artist
}

fragment SmallList_shows on Show {
  id
  ...ArtistShow_show
}

fragment VariableSizeShowsList_shows on Show {
  id
  ...ArtistShow_show
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artistID"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "isPad"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artistID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v8 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "version",
        "value": "large"
      }
    ],
    "kind": "ScalarField",
    "name": "url",
    "storageKey": "url(version:\"large\")"
  }
],
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v10 = [
  (v4/*: any*/),
  (v6/*: any*/)
],
v11 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "ShowEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          (v2/*: any*/),
          (v7/*: any*/),
          {
            "alias": "is_fair_booth",
            "args": null,
            "kind": "ScalarField",
            "name": "isFairBooth",
            "storageKey": null
          },
          {
            "alias": "cover_image",
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "coverImage",
            "plural": false,
            "selections": (v8/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "kind",
            "storageKey": null
          },
          (v4/*: any*/),
          {
            "alias": "exhibition_period",
            "args": null,
            "kind": "ScalarField",
            "name": "exhibitionPeriod",
            "storageKey": null
          },
          {
            "alias": "status_update",
            "args": null,
            "kind": "ScalarField",
            "name": "statusUpdate",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "partner",
            "plural": false,
            "selections": [
              (v9/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v4/*: any*/)
                ],
                "type": "Partner",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": (v10/*: any*/),
                "type": "ExternalPartner",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v6/*: any*/)
                ],
                "type": "Node",
                "abstractKey": "__isNode"
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Location",
            "kind": "LinkedField",
            "name": "location",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "city",
                "storageKey": null
              },
              (v6/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v12 = {
  "kind": "Literal",
  "name": "status",
  "value": "closed"
},
v13 = [
  {
    "kind": "Literal",
    "name": "allowEmptyCreatedDates",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "earliestCreatedYear",
    "value": 1000
  },
  (v5/*: any*/),
  {
    "kind": "Literal",
    "name": "latestCreatedYear",
    "value": 2050
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "DATE_DESC"
  }
],
v14 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
  },
  (v12/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistBelowTheFoldQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtistAbout_artist"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtistShows_artist"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtistInsights_artist"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtistBelowTheFoldQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "hasMetadata",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isDisplayAuctionLink",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "bio",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "blurb",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtistTargetSupply",
            "kind": "LinkedField",
            "name": "targetSupply",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isInMicrofunnel",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isTargetSupply",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "image",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "height",
                    "value": 66
                  },
                  {
                    "kind": "Literal",
                    "name": "width",
                    "value": 66
                  }
                ],
                "concreteType": "CroppedImageUrl",
                "kind": "LinkedField",
                "name": "cropped",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "url",
                    "storageKey": null
                  }
                ],
                "storageKey": "cropped(height:66,width:66)"
              }
            ],
            "storageKey": null
          },
          {
            "alias": "currentShows",
            "args": [
              (v5/*: any*/),
              {
                "kind": "Literal",
                "name": "status",
                "value": "running"
              }
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v11/*: any*/),
            "storageKey": "showsConnection(first:10,status:\"running\")"
          },
          {
            "alias": "upcomingShows",
            "args": [
              (v5/*: any*/),
              {
                "kind": "Literal",
                "name": "status",
                "value": "upcoming"
              }
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v11/*: any*/),
            "storageKey": "showsConnection(first:10,status:\"upcoming\")"
          },
          {
            "alias": "pastShows",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 3
              },
              (v12/*: any*/)
            ],
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": (v11/*: any*/),
            "storageKey": "showsConnection(first:3,status:\"closed\")"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtistRelatedData",
            "kind": "LinkedField",
            "name": "related",
            "plural": false,
            "selections": [
              {
                "alias": "artists",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 16
                  }
                ],
                "concreteType": "ArtistConnection",
                "kind": "LinkedField",
                "name": "artistsConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArtistEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v6/*: any*/),
                          (v7/*: any*/),
                          (v4/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ArtistCounts",
                            "kind": "LinkedField",
                            "name": "counts",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "forSaleArtworks",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "artworks",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "artistsConnection(first:16)"
              }
            ],
            "storageKey": null
          },
          {
            "alias": "articles",
            "args": [
              (v5/*: any*/)
            ],
            "concreteType": "ArticleConnection",
            "kind": "LinkedField",
            "name": "articlesConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ArticleEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Article",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      {
                        "alias": "thumbnail_title",
                        "args": null,
                        "kind": "ScalarField",
                        "name": "thumbnailTitle",
                        "storageKey": null
                      },
                      (v7/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Author",
                        "kind": "LinkedField",
                        "name": "author",
                        "plural": false,
                        "selections": (v10/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": "thumbnail_image",
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "thumbnailImage",
                        "plural": false,
                        "selections": (v8/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "articlesConnection(first:10)"
          },
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "birthday",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v13/*: any*/),
            "concreteType": "AuctionResultConnection",
            "kind": "LinkedField",
            "name": "auctionResultsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "YearRange",
                "kind": "LinkedField",
                "name": "createdYearRange",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "startAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endAt",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "totalCount",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AuctionResultEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AuctionResult",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "currency",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "dateText",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionLotImages",
                        "kind": "LinkedField",
                        "name": "images",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "thumbnail",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "version",
                                    "value": "square140"
                                  }
                                ],
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": "url(version:\"square140\")"
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "height",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "width",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "aspectRatio",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionLotEstimate",
                        "kind": "LinkedField",
                        "name": "estimate",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "low",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "mediumText",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "organization",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "boughtIn",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionLotPerformance",
                        "kind": "LinkedField",
                        "name": "performance",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "mid",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionResultPriceRealized",
                        "kind": "LinkedField",
                        "name": "priceRealized",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "display",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "cents",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "saleDate",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "title",
                        "storageKey": null
                      },
                      (v9/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "PageInfo",
                "kind": "LinkedField",
                "name": "pageInfo",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasNextPage",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "auctionResultsConnection(allowEmptyCreatedDates:true,earliestCreatedYear:1000,first:10,latestCreatedYear:2050,sort:\"DATE_DESC\")"
          },
          {
            "alias": null,
            "args": (v13/*: any*/),
            "filters": [
              "allowEmptyCreatedDates",
              "categories",
              "earliestCreatedYear",
              "latestCreatedYear",
              "sizes",
              "sort"
            ],
            "handle": "connection",
            "key": "artist_auctionResultsConnection",
            "kind": "LinkedHandle",
            "name": "auctionResultsConnection"
          },
          {
            "condition": "isPad",
            "kind": "Condition",
            "passingValue": false,
            "selections": [
              {
                "alias": "pastSmallShows",
                "args": (v14/*: any*/),
                "concreteType": "ShowConnection",
                "kind": "LinkedField",
                "name": "showsConnection",
                "plural": false,
                "selections": (v11/*: any*/),
                "storageKey": "showsConnection(first:20,status:\"closed\")"
              }
            ]
          },
          {
            "condition": "isPad",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "alias": "pastLargeShows",
                "args": (v14/*: any*/),
                "concreteType": "ShowConnection",
                "kind": "LinkedField",
                "name": "showsConnection",
                "plural": false,
                "selections": (v11/*: any*/),
                "storageKey": "showsConnection(first:20,status:\"closed\")"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "186f42defc378934f11085ded50165d7",
    "metadata": {},
    "name": "ArtistBelowTheFoldQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'e0e19647062ef1b54ac09dde940cdf4c';
export default node;
