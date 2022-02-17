/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0bbd5ed4827e4c64b2dc001bbb21605f */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairTestsQueryVariables = {
    fairID: string;
};
export type FairTestsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"Fair_fair">;
    } | null;
};
export type FairTestsQuery = {
    readonly response: FairTestsQueryResponse;
    readonly variables: FairTestsQueryVariables;
};



/*
query FairTestsQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
    ...Fair_fair
    id
  }
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  saleMessage
  slug
  internalID
  artistNames
  href
  sale {
    isAuction
    isClosed
    displayTimelyAt
    endAt
    id
  }
  saleArtwork {
    counts {
      bidderPositions
    }
    currentBid {
      display
    }
    lotLabel
    id
  }
  partner {
    name
    id
  }
  image {
    url(version: "large")
    aspectRatio
  }
  realizedPrice
}

fragment ArtworkRailCard_artwork_hl5k2 on Artwork {
  id
  slug
  internalID
  href
  artistNames
  date
  image {
    resized(width: 155) {
      src
      srcSet
      width
      height
    }
    aspectRatio
  }
  sale {
    isAuction
    isClosed
    endAt
    id
  }
  saleMessage
  saleArtwork {
    counts {
      bidderPositions
    }
    currentBid {
      display
    }
    id
  }
  partner {
    name
    id
  }
  title
  realizedPrice
}

fragment FairArtworks_fair_ZORN9 on Fair {
  slug
  internalID
  fairArtworks: filterArtworksConnection(first: 30, aggregations: [ARTIST, ARTIST_NATIONALITY, COLOR, DIMENSION_RANGE, FOLLOWED_ARTISTS, LOCATION_CITY, MAJOR_PERIOD, MATERIALS_TERMS, MEDIUM, PARTNER, PRICE_RANGE], input: {sort: "-decayed_merch"}) {
    aggregations {
      slice
      counts {
        count
        name
        value
      }
    }
    edges {
      node {
        id
        __typename
      }
      cursor
    }
    counts {
      total
      followedArtists
    }
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
    id
  }
}

fragment FairCollections_fair on Fair {
  internalID
  slug
  marketingCollections(size: 5) {
    slug
    title
    category
    artworks: artworksConnection(first: 3) {
      edges {
        node {
          image {
            url(version: "larger")
          }
          id
        }
      }
      id
    }
    id
  }
}

fragment FairEditorial_fair on Fair {
  internalID
  slug
  articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC) {
    totalCount
    edges {
      node {
        id
        internalID
        slug
        title
        href
        publishedAt(format: "MMM Do, YYYY")
        thumbnailImage {
          src: imageURL
        }
      }
    }
  }
}

fragment FairEmptyState_fair on Fair {
  isActive
  endAt
}

fragment FairExhibitorRail_show on Show {
  internalID
  slug
  href
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
  counts {
    artworks
  }
  fair {
    internalID
    slug
    id
  }
  artworksConnection(first: 20) {
    edges {
      node {
        ...SmallArtworkRail_artworks
        id
      }
    }
  }
}

fragment FairExhibitors_fair on Fair {
  internalID
  slug
  exhibitors: showsConnection(first: 30, sort: FEATURED_ASC) {
    edges {
      node {
        id
        counts {
          artworks
        }
        partner {
          __typename
          ... on Partner {
            id
          }
          ... on ExternalPartner {
            id
          }
          ... on Node {
            __isNode: __typename
            id
          }
        }
        ...FairExhibitorRail_show
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

fragment FairFollowedArtistsRail_fair on Fair {
  internalID
  slug
  filterArtworksConnection(first: 20, input: {includeArtworksByFollowedArtists: true}) {
    edges {
      node {
        ...SmallArtworkRail_artworks
        id
      }
    }
    id
  }
}

fragment FairHeader_fair on Fair {
  about
  summary
  name
  slug
  profile {
    icon {
      imageUrl: url(version: "untouched-png")
    }
    id
  }
  image {
    imageUrl: url(version: "large_rectangle")
    aspectRatio
  }
  tagline
  location {
    summary
    coordinates {
      lat
      lng
    }
    id
  }
  ticketsLink
  sponsoredContent {
    activationText
    pressReleaseUrl
  }
  fairHours: hours(format: MARKDOWN)
  fairLinks: links(format: MARKDOWN)
  fairTickets: tickets(format: MARKDOWN)
  fairContact: contact(format: MARKDOWN)
  ...FairTiming_fair
}

fragment FairTiming_fair on Fair {
  exhibitionPeriod(format: SHORT)
  startAt
  endAt
}

fragment Fair_fair on Fair {
  internalID
  slug
  isActive
  articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC) {
    edges {
      __typename
    }
  }
  marketingCollections(size: 5) {
    __typename
    id
  }
  counts {
    artworks
    partnerShows
  }
  followedArtistArtworks: filterArtworksConnection(first: 20, input: {includeArtworksByFollowedArtists: true}) {
    edges {
      __typename
    }
    id
  }
  ...FairHeader_fair
  ...FairEmptyState_fair
  ...FairEditorial_fair
  ...FairCollections_fair
  ...FairArtworks_fair_ZORN9
  ...FairExhibitors_fair
  ...FairFollowedArtistsRail_fair
}

fragment InfiniteScrollArtworksGrid_connection on ArtworkConnectionInterface {
  __isArtworkConnectionInterface: __typename
  pageInfo {
    hasNextPage
    startCursor
    endCursor
  }
  edges {
    __typename
    node {
      slug
      id
      image {
        aspectRatio
      }
      ...ArtworkGridItem_artwork
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
}

fragment SmallArtworkRail_artworks on Artwork {
  ...ArtworkRailCard_artwork_hl5k2
  internalID
  href
  slug
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "fairID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "fairID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artworks",
  "storageKey": null
},
v9 = {
  "kind": "Literal",
  "name": "first",
  "value": 20
},
v10 = [
  (v9/*: any*/),
  {
    "kind": "Literal",
    "name": "input",
    "value": {
      "includeArtworksByFollowedArtists": true
    }
  }
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "summary",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "aspectRatio",
  "storageKey": null
},
v14 = [
  {
    "kind": "Literal",
    "name": "format",
    "value": "MARKDOWN"
  }
],
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v16 = {
  "kind": "Literal",
  "name": "first",
  "value": 30
},
v17 = [
  {
    "kind": "Literal",
    "name": "aggregations",
    "value": [
      "ARTIST",
      "ARTIST_NATIONALITY",
      "COLOR",
      "DIMENSION_RANGE",
      "FOLLOWED_ARTISTS",
      "LOCATION_CITY",
      "MAJOR_PERIOD",
      "MATERIALS_TERMS",
      "MEDIUM",
      "PARTNER",
      "PRICE_RANGE"
    ]
  },
  (v16/*: any*/),
  {
    "kind": "Literal",
    "name": "input",
    "value": {
      "sort": "-decayed_merch"
    }
  }
],
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v19 = {
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
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleMessage",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAuction",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isClosed",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtworkCounts",
  "kind": "LinkedField",
  "name": "counts",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bidderPositions",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtworkCurrentBid",
  "kind": "LinkedField",
  "name": "currentBid",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "display",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "concreteType": "Partner",
  "kind": "LinkedField",
  "name": "partner",
  "plural": false,
  "selections": [
    (v12/*: any*/),
    (v5/*: any*/)
  ],
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "realizedPrice",
  "storageKey": null
},
v29 = {
  "kind": "InlineFragment",
  "selections": [
    (v5/*: any*/)
  ],
  "type": "Node",
  "abstractKey": "__isNode"
},
v30 = [
  (v16/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "FEATURED_ASC"
  }
],
v31 = [
  (v5/*: any*/),
  (v12/*: any*/)
],
v32 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Artwork",
    "kind": "LinkedField",
    "name": "node",
    "plural": false,
    "selections": [
      (v5/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/),
      (v7/*: any*/),
      (v22/*: any*/),
      (v20/*: any*/),
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
                "name": "width",
                "value": 155
              }
            ],
            "concreteType": "ResizedImageUrl",
            "kind": "LinkedField",
            "name": "resized",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "src",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "srcSet",
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
                "name": "height",
                "storageKey": null
              }
            ],
            "storageKey": "resized(width:155)"
          },
          (v13/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          (v23/*: any*/),
          (v24/*: any*/),
          (v15/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      (v21/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "SaleArtwork",
        "kind": "LinkedField",
        "name": "saleArtwork",
        "plural": false,
        "selections": [
          (v25/*: any*/),
          (v26/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      (v27/*: any*/),
      (v6/*: any*/),
      (v28/*: any*/)
    ],
    "storageKey": null
  }
],
v33 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Fair"
},
v34 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v35 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v36 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v37 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v38 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
},
v39 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FormattedNumber"
},
v40 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v41 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Float"
},
v42 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "ResizedImageUrl"
},
v43 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Partner"
},
v44 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v45 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v46 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtwork"
},
v47 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtworkCounts"
},
v48 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtworkCurrentBid"
},
v49 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "PageInfo"
},
v50 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Boolean"
},
v51 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FilterArtworksConnection"
},
v52 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "FilterArtworksEdge"
},
v53 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FairTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Fair_fair"
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
    "name": "FairTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isActive",
            "storageKey": null
          },
          {
            "alias": "articles",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 5
              },
              {
                "kind": "Literal",
                "name": "sort",
                "value": "PUBLISHED_AT_DESC"
              }
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
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Article",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      {
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "format",
                            "value": "MMM Do, YYYY"
                          }
                        ],
                        "kind": "ScalarField",
                        "name": "publishedAt",
                        "storageKey": "publishedAt(format:\"MMM Do, YYYY\")"
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "thumbnailImage",
                        "plural": false,
                        "selections": [
                          {
                            "alias": "src",
                            "args": null,
                            "kind": "ScalarField",
                            "name": "imageURL",
                            "storageKey": null
                          }
                        ],
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
                "kind": "ScalarField",
                "name": "totalCount",
                "storageKey": null
              }
            ],
            "storageKey": "articlesConnection(first:5,sort:\"PUBLISHED_AT_DESC\")"
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "size",
                "value": 5
              }
            ],
            "concreteType": "MarketingCollection",
            "kind": "LinkedField",
            "name": "marketingCollections",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v3/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "category",
                "storageKey": null
              },
              {
                "alias": "artworks",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 3
                  }
                ],
                "concreteType": "FilterArtworksConnection",
                "kind": "LinkedField",
                "name": "artworksConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FilterArtworksEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
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
                                    "name": "version",
                                    "value": "larger"
                                  }
                                ],
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": "url(version:\"larger\")"
                              }
                            ],
                            "storageKey": null
                          },
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v5/*: any*/)
                ],
                "storageKey": "artworksConnection(first:3)"
              }
            ],
            "storageKey": "marketingCollections(size:5)"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "FairCounts",
            "kind": "LinkedField",
            "name": "counts",
            "plural": false,
            "selections": [
              (v8/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "partnerShows",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": "followedArtistArtworks",
            "args": (v10/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "filterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "FilterArtworksEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              (v5/*: any*/)
            ],
            "storageKey": "filterArtworksConnection(first:20,input:{\"includeArtworksByFollowedArtists\":true})"
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "about",
            "storageKey": null
          },
          (v11/*: any*/),
          (v12/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Profile",
            "kind": "LinkedField",
            "name": "profile",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Image",
                "kind": "LinkedField",
                "name": "icon",
                "plural": false,
                "selections": [
                  {
                    "alias": "imageUrl",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "version",
                        "value": "untouched-png"
                      }
                    ],
                    "kind": "ScalarField",
                    "name": "url",
                    "storageKey": "url(version:\"untouched-png\")"
                  }
                ],
                "storageKey": null
              },
              (v5/*: any*/)
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
            "selections": [
              {
                "alias": "imageUrl",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "version",
                    "value": "large_rectangle"
                  }
                ],
                "kind": "ScalarField",
                "name": "url",
                "storageKey": "url(version:\"large_rectangle\")"
              },
              (v13/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "tagline",
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
              (v11/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "LatLng",
                "kind": "LinkedField",
                "name": "coordinates",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "lat",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "lng",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v5/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "ticketsLink",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "FairSponsoredContent",
            "kind": "LinkedField",
            "name": "sponsoredContent",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "activationText",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "pressReleaseUrl",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": "fairHours",
            "args": (v14/*: any*/),
            "kind": "ScalarField",
            "name": "hours",
            "storageKey": "hours(format:\"MARKDOWN\")"
          },
          {
            "alias": "fairLinks",
            "args": (v14/*: any*/),
            "kind": "ScalarField",
            "name": "links",
            "storageKey": "links(format:\"MARKDOWN\")"
          },
          {
            "alias": "fairTickets",
            "args": (v14/*: any*/),
            "kind": "ScalarField",
            "name": "tickets",
            "storageKey": "tickets(format:\"MARKDOWN\")"
          },
          {
            "alias": "fairContact",
            "args": (v14/*: any*/),
            "kind": "ScalarField",
            "name": "contact",
            "storageKey": "contact(format:\"MARKDOWN\")"
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "format",
                "value": "SHORT"
              }
            ],
            "kind": "ScalarField",
            "name": "exhibitionPeriod",
            "storageKey": "exhibitionPeriod(format:\"SHORT\")"
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startAt",
            "storageKey": null
          },
          (v15/*: any*/),
          {
            "alias": "fairArtworks",
            "args": (v17/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "filterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ArtworksAggregationResults",
                "kind": "LinkedField",
                "name": "aggregations",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "slice",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AggregationCount",
                    "kind": "LinkedField",
                    "name": "counts",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "count",
                        "storageKey": null
                      },
                      (v12/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "value",
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
                "concreteType": "FilterArtworksEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v18/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "FilterArtworksCounts",
                "kind": "LinkedField",
                "name": "counts",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "total",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "followedArtists",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v19/*: any*/),
              (v5/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
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
                        "name": "startCursor",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": [
                              (v13/*: any*/),
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
                            "storageKey": null
                          },
                          (v6/*: any*/),
                          (v20/*: any*/),
                          (v21/*: any*/),
                          (v2/*: any*/),
                          (v22/*: any*/),
                          (v7/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              (v23/*: any*/),
                              (v24/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "displayTimelyAt",
                                "storageKey": null
                              },
                              (v15/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "SaleArtwork",
                            "kind": "LinkedField",
                            "name": "saleArtwork",
                            "plural": false,
                            "selections": [
                              (v25/*: any*/),
                              (v26/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "lotLabel",
                                "storageKey": null
                              },
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v27/*: any*/),
                          (v28/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v29/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "ArtworkConnectionInterface",
                "abstractKey": "__isArtworkConnectionInterface"
              }
            ],
            "storageKey": "filterArtworksConnection(aggregations:[\"ARTIST\",\"ARTIST_NATIONALITY\",\"COLOR\",\"DIMENSION_RANGE\",\"FOLLOWED_ARTISTS\",\"LOCATION_CITY\",\"MAJOR_PERIOD\",\"MATERIALS_TERMS\",\"MEDIUM\",\"PARTNER\",\"PRICE_RANGE\"],first:30,input:{\"sort\":\"-decayed_merch\"})"
          },
          {
            "alias": "fairArtworks",
            "args": (v17/*: any*/),
            "filters": [
              "aggregations",
              "input"
            ],
            "handle": "connection",
            "key": "Fair_fairArtworks",
            "kind": "LinkedHandle",
            "name": "filterArtworksConnection"
          },
          {
            "alias": "exhibitors",
            "args": (v30/*: any*/),
            "concreteType": "ShowConnection",
            "kind": "LinkedField",
            "name": "showsConnection",
            "plural": false,
            "selections": [
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
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ShowCounts",
                        "kind": "LinkedField",
                        "name": "counts",
                        "plural": false,
                        "selections": [
                          (v8/*: any*/)
                        ],
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
                          (v4/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": (v31/*: any*/),
                            "type": "Partner",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": (v31/*: any*/),
                            "type": "ExternalPartner",
                            "abstractKey": null
                          },
                          (v29/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v7/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Fair",
                        "kind": "LinkedField",
                        "name": "fair",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": [
                          (v9/*: any*/)
                        ],
                        "concreteType": "ArtworkConnection",
                        "kind": "LinkedField",
                        "name": "artworksConnection",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ArtworkEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": (v32/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "storageKey": "artworksConnection(first:20)"
                      },
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v18/*: any*/)
                ],
                "storageKey": null
              },
              (v19/*: any*/)
            ],
            "storageKey": "showsConnection(first:30,sort:\"FEATURED_ASC\")"
          },
          {
            "alias": "exhibitors",
            "args": (v30/*: any*/),
            "filters": [
              "sort"
            ],
            "handle": "connection",
            "key": "FairExhibitorsQuery_exhibitors",
            "kind": "LinkedHandle",
            "name": "showsConnection"
          },
          {
            "alias": null,
            "args": (v10/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "filterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "FilterArtworksEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": (v32/*: any*/),
                "storageKey": null
              },
              (v5/*: any*/)
            ],
            "storageKey": "filterArtworksConnection(first:20,input:{\"includeArtworksByFollowedArtists\":true})"
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "0bbd5ed4827e4c64b2dc001bbb21605f",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "fair": (v33/*: any*/),
        "fair.about": (v34/*: any*/),
        "fair.articles": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArticleConnection"
        },
        "fair.articles.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArticleEdge"
        },
        "fair.articles.edges.__typename": (v35/*: any*/),
        "fair.articles.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Article"
        },
        "fair.articles.edges.node.href": (v34/*: any*/),
        "fair.articles.edges.node.id": (v36/*: any*/),
        "fair.articles.edges.node.internalID": (v36/*: any*/),
        "fair.articles.edges.node.publishedAt": (v34/*: any*/),
        "fair.articles.edges.node.slug": (v34/*: any*/),
        "fair.articles.edges.node.thumbnailImage": (v37/*: any*/),
        "fair.articles.edges.node.thumbnailImage.src": (v34/*: any*/),
        "fair.articles.edges.node.title": (v34/*: any*/),
        "fair.articles.totalCount": (v38/*: any*/),
        "fair.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FairCounts"
        },
        "fair.counts.artworks": (v39/*: any*/),
        "fair.counts.partnerShows": (v39/*: any*/),
        "fair.endAt": (v34/*: any*/),
        "fair.exhibitionPeriod": (v34/*: any*/),
        "fair.exhibitors": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ShowConnection"
        },
        "fair.exhibitors.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ShowEdge"
        },
        "fair.exhibitors.edges.cursor": (v35/*: any*/),
        "fair.exhibitors.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Show"
        },
        "fair.exhibitors.edges.node.__typename": (v35/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtworkConnection"
        },
        "fair.exhibitors.edges.node.artworksConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdge"
        },
        "fair.exhibitors.edges.node.artworksConnection.edges.node": (v40/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.artistNames": (v34/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.date": (v34/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.href": (v34/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.id": (v36/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.image": (v37/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.image.aspectRatio": (v41/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.image.resized": (v42/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.image.resized.height": (v38/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.image.resized.src": (v35/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.image.resized.srcSet": (v35/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.image.resized.width": (v38/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.internalID": (v36/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.partner": (v43/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.partner.id": (v36/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.partner.name": (v34/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.realizedPrice": (v34/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.sale": (v44/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.sale.endAt": (v34/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.sale.id": (v36/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.sale.isAuction": (v45/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.sale.isClosed": (v45/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.saleArtwork": (v46/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.saleArtwork.counts": (v47/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.saleArtwork.counts.bidderPositions": (v39/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.saleArtwork.currentBid": (v48/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.saleArtwork.currentBid.display": (v34/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.saleArtwork.id": (v36/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.saleMessage": (v34/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.slug": (v36/*: any*/),
        "fair.exhibitors.edges.node.artworksConnection.edges.node.title": (v34/*: any*/),
        "fair.exhibitors.edges.node.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ShowCounts"
        },
        "fair.exhibitors.edges.node.counts.artworks": (v38/*: any*/),
        "fair.exhibitors.edges.node.fair": (v33/*: any*/),
        "fair.exhibitors.edges.node.fair.id": (v36/*: any*/),
        "fair.exhibitors.edges.node.fair.internalID": (v36/*: any*/),
        "fair.exhibitors.edges.node.fair.slug": (v36/*: any*/),
        "fair.exhibitors.edges.node.href": (v34/*: any*/),
        "fair.exhibitors.edges.node.id": (v36/*: any*/),
        "fair.exhibitors.edges.node.internalID": (v36/*: any*/),
        "fair.exhibitors.edges.node.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "PartnerTypes"
        },
        "fair.exhibitors.edges.node.partner.__isNode": (v35/*: any*/),
        "fair.exhibitors.edges.node.partner.__typename": (v35/*: any*/),
        "fair.exhibitors.edges.node.partner.id": (v36/*: any*/),
        "fair.exhibitors.edges.node.partner.name": (v34/*: any*/),
        "fair.exhibitors.edges.node.slug": (v36/*: any*/),
        "fair.exhibitors.pageInfo": (v49/*: any*/),
        "fair.exhibitors.pageInfo.endCursor": (v34/*: any*/),
        "fair.exhibitors.pageInfo.hasNextPage": (v50/*: any*/),
        "fair.fairArtworks": (v51/*: any*/),
        "fair.fairArtworks.__isArtworkConnectionInterface": (v35/*: any*/),
        "fair.fairArtworks.aggregations": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworksAggregationResults"
        },
        "fair.fairArtworks.aggregations.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "AggregationCount"
        },
        "fair.fairArtworks.aggregations.counts.count": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Int"
        },
        "fair.fairArtworks.aggregations.counts.name": (v35/*: any*/),
        "fair.fairArtworks.aggregations.counts.value": (v35/*: any*/),
        "fair.fairArtworks.aggregations.slice": {
          "enumValues": [
            "ARTIST",
            "ARTIST_NATIONALITY",
            "ATTRIBUTION_CLASS",
            "COLOR",
            "DIMENSION_RANGE",
            "FOLLOWED_ARTISTS",
            "GALLERY",
            "INSTITUTION",
            "LOCATION_CITY",
            "MAJOR_PERIOD",
            "MATERIALS_TERMS",
            "MEDIUM",
            "MERCHANDISABLE_ARTISTS",
            "PARTNER",
            "PARTNER_CITY",
            "PERIOD",
            "PRICE_RANGE",
            "TOTAL"
          ],
          "nullable": true,
          "plural": false,
          "type": "ArtworkAggregation"
        },
        "fair.fairArtworks.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterArtworksCounts"
        },
        "fair.fairArtworks.counts.followedArtists": (v39/*: any*/),
        "fair.fairArtworks.counts.total": (v39/*: any*/),
        "fair.fairArtworks.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdgeInterface"
        },
        "fair.fairArtworks.edges.__isNode": (v35/*: any*/),
        "fair.fairArtworks.edges.__typename": (v35/*: any*/),
        "fair.fairArtworks.edges.cursor": (v35/*: any*/),
        "fair.fairArtworks.edges.id": (v36/*: any*/),
        "fair.fairArtworks.edges.node": (v40/*: any*/),
        "fair.fairArtworks.edges.node.__typename": (v35/*: any*/),
        "fair.fairArtworks.edges.node.artistNames": (v34/*: any*/),
        "fair.fairArtworks.edges.node.date": (v34/*: any*/),
        "fair.fairArtworks.edges.node.href": (v34/*: any*/),
        "fair.fairArtworks.edges.node.id": (v36/*: any*/),
        "fair.fairArtworks.edges.node.image": (v37/*: any*/),
        "fair.fairArtworks.edges.node.image.aspectRatio": (v41/*: any*/),
        "fair.fairArtworks.edges.node.image.url": (v34/*: any*/),
        "fair.fairArtworks.edges.node.internalID": (v36/*: any*/),
        "fair.fairArtworks.edges.node.partner": (v43/*: any*/),
        "fair.fairArtworks.edges.node.partner.id": (v36/*: any*/),
        "fair.fairArtworks.edges.node.partner.name": (v34/*: any*/),
        "fair.fairArtworks.edges.node.realizedPrice": (v34/*: any*/),
        "fair.fairArtworks.edges.node.sale": (v44/*: any*/),
        "fair.fairArtworks.edges.node.sale.displayTimelyAt": (v34/*: any*/),
        "fair.fairArtworks.edges.node.sale.endAt": (v34/*: any*/),
        "fair.fairArtworks.edges.node.sale.id": (v36/*: any*/),
        "fair.fairArtworks.edges.node.sale.isAuction": (v45/*: any*/),
        "fair.fairArtworks.edges.node.sale.isClosed": (v45/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork": (v46/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.counts": (v47/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.counts.bidderPositions": (v39/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.currentBid": (v48/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.currentBid.display": (v34/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.id": (v36/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.lotLabel": (v34/*: any*/),
        "fair.fairArtworks.edges.node.saleMessage": (v34/*: any*/),
        "fair.fairArtworks.edges.node.slug": (v36/*: any*/),
        "fair.fairArtworks.edges.node.title": (v34/*: any*/),
        "fair.fairArtworks.id": (v36/*: any*/),
        "fair.fairArtworks.pageInfo": (v49/*: any*/),
        "fair.fairArtworks.pageInfo.endCursor": (v34/*: any*/),
        "fair.fairArtworks.pageInfo.hasNextPage": (v50/*: any*/),
        "fair.fairArtworks.pageInfo.startCursor": (v34/*: any*/),
        "fair.fairContact": (v34/*: any*/),
        "fair.fairHours": (v34/*: any*/),
        "fair.fairLinks": (v34/*: any*/),
        "fair.fairTickets": (v34/*: any*/),
        "fair.filterArtworksConnection": (v51/*: any*/),
        "fair.filterArtworksConnection.edges": (v52/*: any*/),
        "fair.filterArtworksConnection.edges.node": (v40/*: any*/),
        "fair.filterArtworksConnection.edges.node.artistNames": (v34/*: any*/),
        "fair.filterArtworksConnection.edges.node.date": (v34/*: any*/),
        "fair.filterArtworksConnection.edges.node.href": (v34/*: any*/),
        "fair.filterArtworksConnection.edges.node.id": (v36/*: any*/),
        "fair.filterArtworksConnection.edges.node.image": (v37/*: any*/),
        "fair.filterArtworksConnection.edges.node.image.aspectRatio": (v41/*: any*/),
        "fair.filterArtworksConnection.edges.node.image.resized": (v42/*: any*/),
        "fair.filterArtworksConnection.edges.node.image.resized.height": (v38/*: any*/),
        "fair.filterArtworksConnection.edges.node.image.resized.src": (v35/*: any*/),
        "fair.filterArtworksConnection.edges.node.image.resized.srcSet": (v35/*: any*/),
        "fair.filterArtworksConnection.edges.node.image.resized.width": (v38/*: any*/),
        "fair.filterArtworksConnection.edges.node.internalID": (v36/*: any*/),
        "fair.filterArtworksConnection.edges.node.partner": (v43/*: any*/),
        "fair.filterArtworksConnection.edges.node.partner.id": (v36/*: any*/),
        "fair.filterArtworksConnection.edges.node.partner.name": (v34/*: any*/),
        "fair.filterArtworksConnection.edges.node.realizedPrice": (v34/*: any*/),
        "fair.filterArtworksConnection.edges.node.sale": (v44/*: any*/),
        "fair.filterArtworksConnection.edges.node.sale.endAt": (v34/*: any*/),
        "fair.filterArtworksConnection.edges.node.sale.id": (v36/*: any*/),
        "fair.filterArtworksConnection.edges.node.sale.isAuction": (v45/*: any*/),
        "fair.filterArtworksConnection.edges.node.sale.isClosed": (v45/*: any*/),
        "fair.filterArtworksConnection.edges.node.saleArtwork": (v46/*: any*/),
        "fair.filterArtworksConnection.edges.node.saleArtwork.counts": (v47/*: any*/),
        "fair.filterArtworksConnection.edges.node.saleArtwork.counts.bidderPositions": (v39/*: any*/),
        "fair.filterArtworksConnection.edges.node.saleArtwork.currentBid": (v48/*: any*/),
        "fair.filterArtworksConnection.edges.node.saleArtwork.currentBid.display": (v34/*: any*/),
        "fair.filterArtworksConnection.edges.node.saleArtwork.id": (v36/*: any*/),
        "fair.filterArtworksConnection.edges.node.saleMessage": (v34/*: any*/),
        "fair.filterArtworksConnection.edges.node.slug": (v36/*: any*/),
        "fair.filterArtworksConnection.edges.node.title": (v34/*: any*/),
        "fair.filterArtworksConnection.id": (v36/*: any*/),
        "fair.followedArtistArtworks": (v51/*: any*/),
        "fair.followedArtistArtworks.edges": (v52/*: any*/),
        "fair.followedArtistArtworks.edges.__typename": (v35/*: any*/),
        "fair.followedArtistArtworks.id": (v36/*: any*/),
        "fair.id": (v36/*: any*/),
        "fair.image": (v37/*: any*/),
        "fair.image.aspectRatio": (v41/*: any*/),
        "fair.image.imageUrl": (v34/*: any*/),
        "fair.internalID": (v36/*: any*/),
        "fair.isActive": (v45/*: any*/),
        "fair.location": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Location"
        },
        "fair.location.coordinates": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "LatLng"
        },
        "fair.location.coordinates.lat": (v53/*: any*/),
        "fair.location.coordinates.lng": (v53/*: any*/),
        "fair.location.id": (v36/*: any*/),
        "fair.location.summary": (v34/*: any*/),
        "fair.marketingCollections": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "MarketingCollection"
        },
        "fair.marketingCollections.__typename": (v35/*: any*/),
        "fair.marketingCollections.artworks": (v51/*: any*/),
        "fair.marketingCollections.artworks.edges": (v52/*: any*/),
        "fair.marketingCollections.artworks.edges.node": (v40/*: any*/),
        "fair.marketingCollections.artworks.edges.node.id": (v36/*: any*/),
        "fair.marketingCollections.artworks.edges.node.image": (v37/*: any*/),
        "fair.marketingCollections.artworks.edges.node.image.url": (v34/*: any*/),
        "fair.marketingCollections.artworks.id": (v36/*: any*/),
        "fair.marketingCollections.category": (v35/*: any*/),
        "fair.marketingCollections.id": (v36/*: any*/),
        "fair.marketingCollections.slug": (v35/*: any*/),
        "fair.marketingCollections.title": (v35/*: any*/),
        "fair.name": (v34/*: any*/),
        "fair.profile": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Profile"
        },
        "fair.profile.icon": (v37/*: any*/),
        "fair.profile.icon.imageUrl": (v34/*: any*/),
        "fair.profile.id": (v36/*: any*/),
        "fair.slug": (v36/*: any*/),
        "fair.sponsoredContent": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FairSponsoredContent"
        },
        "fair.sponsoredContent.activationText": (v34/*: any*/),
        "fair.sponsoredContent.pressReleaseUrl": (v34/*: any*/),
        "fair.startAt": (v34/*: any*/),
        "fair.summary": (v34/*: any*/),
        "fair.tagline": (v34/*: any*/),
        "fair.ticketsLink": (v34/*: any*/)
      }
    },
    "name": "FairTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '192a14f465374c22910874dbeac69dc1';
export default node;
