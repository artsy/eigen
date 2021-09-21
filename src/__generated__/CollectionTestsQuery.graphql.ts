/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash fd332d1f9d5eaa85ff628fbbcb9df842 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionTestsQueryVariables = {};
export type CollectionTestsQueryResponse = {
    readonly marketingCollection: {
        readonly " $fragmentRefs": FragmentRefs<"Collection_collection">;
    } | null;
};
export type CollectionTestsQuery = {
    readonly response: CollectionTestsQueryResponse;
    readonly variables: CollectionTestsQueryVariables;
};



/*
query CollectionTestsQuery {
  marketingCollection(slug: "doesn't matter") {
    ...Collection_collection
    id
  }
}

fragment ArtistListItem_artist on Artist {
  id
  internalID
  slug
  name
  initials
  href
  is_followed: isFollowed
  nationality
  birthday
  deathday
  image {
    url
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
}

fragment CollectionArtistSeriesRail_collection on MarketingCollection {
  slug
  id
}

fragment CollectionArtistSeriesRail_collectionGroup on MarketingCollectionGroup {
  name
  members {
    slug
    id
    title
    priceGuidance
    artworksConnection(first: 3, aggregations: [TOTAL], sort: "-decayed_merch") {
      edges {
        node {
          title
          image {
            url
          }
          id
        }
      }
      id
    }
  }
}

fragment CollectionArtworksFilter_collection on MarketingCollection {
  slug
  id
}

fragment CollectionArtworks_collection_2T6kBV on MarketingCollection {
  isDepartment
  slug
  id
  collectionArtworks: artworksConnection(first: 10, aggregations: [ARTIST, ARTIST_NATIONALITY, COLOR, DIMENSION_RANGE, LOCATION_CITY, MAJOR_PERIOD, MATERIALS_TERMS, MEDIUM, PARTNER, PRICE_RANGE], input: {sort: "-decayed_merch", dimensionRange: "*-*"}) {
    aggregations {
      slice
      counts {
        value
        name
        count
      }
    }
    counts {
      total
    }
    edges {
      node {
        id
        __typename
      }
      cursor
    }
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
    id
  }
}

fragment CollectionHeader_collection on MarketingCollection {
  title
  headerImage
  descriptionMarkdown
  image: artworksConnection(sort: "-decayed_merch", first: 1) {
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
}

fragment CollectionHubsRails_collection on MarketingCollection {
  ...CollectionArtistSeriesRail_collection
  ...FeaturedCollectionsRail_collection
}

fragment CollectionHubsRails_linkedCollections on MarketingCollectionGroup {
  groupType
  ...CollectionArtistSeriesRail_collectionGroup
  ...OtherCollectionsRail_collectionGroup
  ...FeaturedCollectionsRail_collectionGroup
}

fragment Collection_collection on MarketingCollection {
  id
  slug
  isDepartment
  ...CollectionHeader_collection
  ...CollectionArtworks_collection_2T6kBV
  ...CollectionArtworksFilter_collection
  ...FeaturedArtists_collection
  ...CollectionHubsRails_collection
  linkedCollections {
    ...CollectionHubsRails_linkedCollections
  }
}

fragment FeaturedArtists_collection on MarketingCollection {
  slug
  artworksConnection(aggregations: [MERCHANDISABLE_ARTISTS], size: 0, sort: "-decayed_merch") {
    merchandisableArtists(size: 4) {
      internalID
      ...ArtistListItem_artist
      id
    }
    id
  }
  query {
    artistIDs
    id
  }
  featuredArtistExclusionIds
}

fragment FeaturedCollectionsRail_collection on MarketingCollection {
  slug
  id
}

fragment FeaturedCollectionsRail_collectionGroup on MarketingCollectionGroup {
  name
  members {
    slug
    id
    title
    priceGuidance
    descriptionMarkdown
    featuredCollectionArtworks: artworksConnection(first: 1, aggregations: [TOTAL], sort: "-decayed_merch") {
      edges {
        node {
          image {
            url
          }
          id
        }
      }
      id
    }
  }
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
      ...MyCollectionArtworkListItem_artwork
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
}

fragment MyCollectionArtworkListItem_artwork on Artwork {
  internalID
  artist {
    internalID
    id
  }
  images {
    url
    isDefault
  }
  image {
    aspectRatio
  }
  artistNames
  medium
  slug
  title
  date
}

fragment OtherCollectionsRail_collectionGroup on MarketingCollectionGroup {
  groupType
  name
  members {
    id
    slug
    title
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "slug",
    "value": "doesn't matter"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
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
  "name": "title",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "descriptionMarkdown",
  "storageKey": null
},
v5 = {
  "kind": "Literal",
  "name": "first",
  "value": 1
},
v6 = {
  "kind": "Literal",
  "name": "sort",
  "value": "-decayed_merch"
},
v7 = [
  {
    "kind": "Literal",
    "name": "aggregations",
    "value": [
      "ARTIST",
      "ARTIST_NATIONALITY",
      "COLOR",
      "DIMENSION_RANGE",
      "LOCATION_CITY",
      "MAJOR_PERIOD",
      "MATERIALS_TERMS",
      "MEDIUM",
      "PARTNER",
      "PRICE_RANGE"
    ]
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  {
    "kind": "Literal",
    "name": "input",
    "value": {
      "dimensionRange": "*-*",
      "sort": "-decayed_merch"
    }
  }
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "image",
  "plural": false,
  "selections": [
    (v12/*: any*/)
  ],
  "storageKey": null
},
v14 = {
  "kind": "Literal",
  "name": "aggregations",
  "value": [
    "TOTAL"
  ]
},
v15 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FilterArtworksConnection"
},
v16 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v17 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v18 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v19 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v20 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v21 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FormattedNumber"
},
v22 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v23 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Boolean"
},
v24 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "String"
},
v25 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "FilterArtworksEdge"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CollectionTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "kind": "LinkedField",
        "name": "marketingCollection",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Collection_collection"
          }
        ],
        "storageKey": "marketingCollection(slug:\"doesn't matter\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CollectionTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "kind": "LinkedField",
        "name": "marketingCollection",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isDepartment",
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "headerImage",
            "storageKey": null
          },
          (v4/*: any*/),
          {
            "alias": "image",
            "args": [
              (v5/*: any*/),
              (v6/*: any*/)
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
                      (v1/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": "artworksConnection(first:1,sort:\"-decayed_merch\")"
          },
          {
            "alias": "collectionArtworks",
            "args": (v7/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "artworksConnection",
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
                        "name": "value",
                        "storageKey": null
                      },
                      (v8/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "count",
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
                      (v1/*: any*/),
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
              },
              (v1/*: any*/),
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
                      (v9/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
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
                                "args": null,
                                "kind": "ScalarField",
                                "name": "aspectRatio",
                                "storageKey": null
                              },
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
                          (v3/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "date",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "saleMessage",
                            "storageKey": null
                          },
                          (v10/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "artistNames",
                            "storageKey": null
                          },
                          (v11/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isAuction",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isClosed",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "displayTimelyAt",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "endAt",
                                "storageKey": null
                              },
                              (v1/*: any*/)
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
                              {
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
                              {
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
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "lotLabel",
                                "storageKey": null
                              },
                              (v1/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Partner",
                            "kind": "LinkedField",
                            "name": "partner",
                            "plural": false,
                            "selections": [
                              (v8/*: any*/),
                              (v1/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artist",
                            "kind": "LinkedField",
                            "name": "artist",
                            "plural": false,
                            "selections": [
                              (v10/*: any*/),
                              (v1/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "images",
                            "plural": true,
                            "selections": [
                              (v12/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isDefault",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "medium",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v1/*: any*/)
                        ],
                        "type": "Node",
                        "abstractKey": "__isNode"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "type": "ArtworkConnectionInterface",
                "abstractKey": "__isArtworkConnectionInterface"
              }
            ],
            "storageKey": "artworksConnection(aggregations:[\"ARTIST\",\"ARTIST_NATIONALITY\",\"COLOR\",\"DIMENSION_RANGE\",\"LOCATION_CITY\",\"MAJOR_PERIOD\",\"MATERIALS_TERMS\",\"MEDIUM\",\"PARTNER\",\"PRICE_RANGE\"],first:10,input:{\"dimensionRange\":\"*-*\",\"sort\":\"-decayed_merch\"})"
          },
          {
            "alias": "collectionArtworks",
            "args": (v7/*: any*/),
            "filters": [
              "aggregations",
              "input"
            ],
            "handle": "connection",
            "key": "Collection_collectionArtworks",
            "kind": "LinkedHandle",
            "name": "artworksConnection"
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "aggregations",
                "value": [
                  "MERCHANDISABLE_ARTISTS"
                ]
              },
              {
                "kind": "Literal",
                "name": "size",
                "value": 0
              },
              (v6/*: any*/)
            ],
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "artworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "size",
                    "value": 4
                  }
                ],
                "concreteType": "Artist",
                "kind": "LinkedField",
                "name": "merchandisableArtists",
                "plural": true,
                "selections": [
                  (v10/*: any*/),
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "initials",
                    "storageKey": null
                  },
                  (v11/*: any*/),
                  {
                    "alias": "is_followed",
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isFollowed",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "nationality",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "birthday",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "deathday",
                    "storageKey": null
                  },
                  (v13/*: any*/)
                ],
                "storageKey": "merchandisableArtists(size:4)"
              },
              (v1/*: any*/)
            ],
            "storageKey": "artworksConnection(aggregations:[\"MERCHANDISABLE_ARTISTS\"],size:0,sort:\"-decayed_merch\")"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "MarketingCollectionQuery",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "artistIDs",
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "featuredArtistExclusionIds",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "MarketingCollectionGroup",
            "kind": "LinkedField",
            "name": "linkedCollections",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "groupType",
                "storageKey": null
              },
              (v8/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "MarketingCollection",
                "kind": "LinkedField",
                "name": "members",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v1/*: any*/),
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "priceGuidance",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": [
                      (v14/*: any*/),
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 3
                      },
                      (v6/*: any*/)
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
                              (v3/*: any*/),
                              (v13/*: any*/),
                              (v1/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v1/*: any*/)
                    ],
                    "storageKey": "artworksConnection(aggregations:[\"TOTAL\"],first:3,sort:\"-decayed_merch\")"
                  },
                  (v4/*: any*/),
                  {
                    "alias": "featuredCollectionArtworks",
                    "args": [
                      (v14/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/)
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
                              (v13/*: any*/),
                              (v1/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v1/*: any*/)
                    ],
                    "storageKey": "artworksConnection(aggregations:[\"TOTAL\"],first:1,sort:\"-decayed_merch\")"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "marketingCollection(slug:\"doesn't matter\")"
      }
    ]
  },
  "params": {
    "id": "fd332d1f9d5eaa85ff628fbbcb9df842",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "marketingCollection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MarketingCollection"
        },
        "marketingCollection.artworksConnection": (v15/*: any*/),
        "marketingCollection.artworksConnection.id": (v16/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Artist"
        },
        "marketingCollection.artworksConnection.merchandisableArtists.birthday": (v17/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.deathday": (v17/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.href": (v17/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.id": (v16/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.image": (v18/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.image.url": (v17/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.initials": (v17/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.internalID": (v16/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.is_followed": (v19/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.name": (v17/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.nationality": (v17/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.slug": (v16/*: any*/),
        "marketingCollection.collectionArtworks": (v15/*: any*/),
        "marketingCollection.collectionArtworks.__isArtworkConnectionInterface": (v20/*: any*/),
        "marketingCollection.collectionArtworks.aggregations": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworksAggregationResults"
        },
        "marketingCollection.collectionArtworks.aggregations.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "AggregationCount"
        },
        "marketingCollection.collectionArtworks.aggregations.counts.count": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Int"
        },
        "marketingCollection.collectionArtworks.aggregations.counts.name": (v20/*: any*/),
        "marketingCollection.collectionArtworks.aggregations.counts.value": (v20/*: any*/),
        "marketingCollection.collectionArtworks.aggregations.slice": {
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
        "marketingCollection.collectionArtworks.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterArtworksCounts"
        },
        "marketingCollection.collectionArtworks.counts.total": (v21/*: any*/),
        "marketingCollection.collectionArtworks.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdgeInterface"
        },
        "marketingCollection.collectionArtworks.edges.__isNode": (v20/*: any*/),
        "marketingCollection.collectionArtworks.edges.__typename": (v20/*: any*/),
        "marketingCollection.collectionArtworks.edges.cursor": (v20/*: any*/),
        "marketingCollection.collectionArtworks.edges.id": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node": (v22/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.__typename": (v20/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.artist": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artist"
        },
        "marketingCollection.collectionArtworks.edges.node.artist.id": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.artist.internalID": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.artistNames": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.date": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.href": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.id": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image": (v18/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
        "marketingCollection.collectionArtworks.edges.node.image.url": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.images": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Image"
        },
        "marketingCollection.collectionArtworks.edges.node.images.isDefault": (v19/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.images.url": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.internalID": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.medium": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "marketingCollection.collectionArtworks.edges.node.partner.id": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner.name": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Sale"
        },
        "marketingCollection.collectionArtworks.edges.node.sale.displayTimelyAt": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.endAt": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.id": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.isAuction": (v19/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.isClosed": (v19/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.saleArtwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtwork"
        },
        "marketingCollection.collectionArtworks.edges.node.saleArtwork.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCounts"
        },
        "marketingCollection.collectionArtworks.edges.node.saleArtwork.counts.bidderPositions": (v21/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.saleArtwork.currentBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCurrentBid"
        },
        "marketingCollection.collectionArtworks.edges.node.saleArtwork.currentBid.display": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.saleArtwork.id": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.saleArtwork.lotLabel": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.saleMessage": (v17/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.slug": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.title": (v17/*: any*/),
        "marketingCollection.collectionArtworks.id": (v16/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "marketingCollection.collectionArtworks.pageInfo.endCursor": (v17/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo.hasNextPage": (v23/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo.startCursor": (v17/*: any*/),
        "marketingCollection.descriptionMarkdown": (v17/*: any*/),
        "marketingCollection.featuredArtistExclusionIds": (v24/*: any*/),
        "marketingCollection.headerImage": (v17/*: any*/),
        "marketingCollection.id": (v16/*: any*/),
        "marketingCollection.image": (v15/*: any*/),
        "marketingCollection.image.edges": (v25/*: any*/),
        "marketingCollection.image.edges.node": (v22/*: any*/),
        "marketingCollection.image.edges.node.id": (v16/*: any*/),
        "marketingCollection.image.edges.node.image": (v18/*: any*/),
        "marketingCollection.image.edges.node.image.url": (v17/*: any*/),
        "marketingCollection.image.id": (v16/*: any*/),
        "marketingCollection.isDepartment": (v23/*: any*/),
        "marketingCollection.linkedCollections": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "MarketingCollectionGroup"
        },
        "marketingCollection.linkedCollections.groupType": {
          "enumValues": [
            "ArtistSeries",
            "FeaturedCollections",
            "OtherCollections"
          ],
          "nullable": false,
          "plural": false,
          "type": "MarketingGroupTypes"
        },
        "marketingCollection.linkedCollections.members": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "MarketingCollection"
        },
        "marketingCollection.linkedCollections.members.artworksConnection": (v15/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges": (v25/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node": (v22/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node.id": (v16/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node.image": (v18/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node.image.url": (v17/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node.title": (v17/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.id": (v16/*: any*/),
        "marketingCollection.linkedCollections.members.descriptionMarkdown": (v17/*: any*/),
        "marketingCollection.linkedCollections.members.featuredCollectionArtworks": (v15/*: any*/),
        "marketingCollection.linkedCollections.members.featuredCollectionArtworks.edges": (v25/*: any*/),
        "marketingCollection.linkedCollections.members.featuredCollectionArtworks.edges.node": (v22/*: any*/),
        "marketingCollection.linkedCollections.members.featuredCollectionArtworks.edges.node.id": (v16/*: any*/),
        "marketingCollection.linkedCollections.members.featuredCollectionArtworks.edges.node.image": (v18/*: any*/),
        "marketingCollection.linkedCollections.members.featuredCollectionArtworks.edges.node.image.url": (v17/*: any*/),
        "marketingCollection.linkedCollections.members.featuredCollectionArtworks.id": (v16/*: any*/),
        "marketingCollection.linkedCollections.members.id": (v16/*: any*/),
        "marketingCollection.linkedCollections.members.priceGuidance": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Float"
        },
        "marketingCollection.linkedCollections.members.slug": (v20/*: any*/),
        "marketingCollection.linkedCollections.members.title": (v20/*: any*/),
        "marketingCollection.linkedCollections.name": (v20/*: any*/),
        "marketingCollection.query": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "MarketingCollectionQuery"
        },
        "marketingCollection.query.artistIDs": (v24/*: any*/),
        "marketingCollection.query.id": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ID"
        },
        "marketingCollection.slug": (v20/*: any*/),
        "marketingCollection.title": (v20/*: any*/)
      }
    },
    "name": "CollectionTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'fbe5831179fb6d1e2f66b7360c128d63';
export default node;
