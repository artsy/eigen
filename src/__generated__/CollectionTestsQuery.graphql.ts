/* tslint:disable */
/* eslint-disable */
/* @relayHash 56db3dc81fdfc01abb5e96d22bb9f416 */

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
  sale_message: saleMessage
  is_biddable: isBiddable
  is_acquireable: isAcquireable
  is_offerable: isOfferable
  slug
  sale {
    is_auction: isAuction
    is_closed: isClosed
    display_timely_at: displayTimelyAt
    id
  }
  sale_artwork: saleArtwork {
    current_bid: currentBid {
      display
    }
    id
  }
  image {
    url(version: "large")
    aspect_ratio: aspectRatio
  }
  artists(shallow: true) {
    name
    id
  }
  partner {
    name
    id
  }
  href
}

fragment CollectionArtistSeriesRail_collectionGroup on MarketingCollectionGroup {
  name
  members {
    slug
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
    defaultHeader: artworksConnection(sort: "-decayed_merch", first: 1) {
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
    id
  }
}

fragment CollectionArtworks_collection on MarketingCollection {
  isDepartment
  slug
  id
  collectionArtworks: artworksConnection(first: 10, after: "", sort: "-decayed_merch", medium: "*", aggregations: [MEDIUM], priceRange: "") {
    counts {
      total
    }
    aggregations {
      slice
      counts {
        value
        name
        count
      }
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

fragment CollectionHubsRails_linkedCollections on MarketingCollectionGroup {
  groupType
  ...CollectionArtistSeriesRail_collectionGroup
}

fragment Collection_collection on MarketingCollection {
  id
  slug
  isDepartment
  ...CollectionHeader_collection
  ...CollectionArtworks_collection
  ...FeaturedArtists_collection
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

fragment InfiniteScrollArtworksGrid_connection on ArtworkConnectionInterface {
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
      id
    }
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
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "Literal",
  "name": "sort",
  "value": "-decayed_merch"
},
v5 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  },
  (v4/*: any*/)
],
v6 = [
  {
    "kind": "Literal",
    "name": "after",
    "value": ""
  },
  {
    "kind": "Literal",
    "name": "aggregations",
    "value": [
      "MEDIUM"
    ]
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  {
    "kind": "Literal",
    "name": "medium",
    "value": "*"
  },
  {
    "kind": "Literal",
    "name": "priceRange",
    "value": ""
  },
  (v4/*: any*/)
],
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v8 = [
  (v7/*: any*/),
  (v1/*: any*/)
],
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "url",
      "args": null,
      "storageKey": null
    }
  ]
},
v11 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v12 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v13 = {
  "type": "Boolean",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v14 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v15 = {
  "type": "FilterArtworksConnection",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v16 = {
  "type": "String",
  "enumValues": null,
  "plural": true,
  "nullable": true
},
v17 = {
  "type": "FilterArtworksEdge",
  "enumValues": null,
  "plural": true,
  "nullable": true
},
v18 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v19 = {
  "type": "Artist",
  "enumValues": null,
  "plural": true,
  "nullable": true
},
v20 = {
  "type": "Artwork",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v21 = {
  "type": "Image",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v22 = {
  "type": "Boolean",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v23 = {
  "type": "Float",
  "enumValues": null,
  "plural": false,
  "nullable": false
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "CollectionTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollection",
        "storageKey": "marketingCollection(slug:\"doesn't matter\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Collection_collection",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "CollectionTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollection",
        "storageKey": "marketingCollection(slug:\"doesn't matter\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isDepartment",
            "args": null,
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "headerImage",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "descriptionMarkdown",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "image",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(first:1,sort:\"-decayed_merch\")",
            "args": (v5/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "FilterArtworksEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "image",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "url",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "larger"
                              }
                            ],
                            "storageKey": "url(version:\"larger\")"
                          }
                        ]
                      },
                      (v1/*: any*/)
                    ]
                  }
                ]
              },
              (v1/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "collectionArtworks",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(after:\"\",aggregations:[\"MEDIUM\"],first:10,medium:\"*\",priceRange:\"\",sort:\"-decayed_merch\")",
            "args": (v6/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "counts",
                "storageKey": null,
                "args": null,
                "concreteType": "FilterArtworksCounts",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "total",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "aggregations",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtworksAggregationResults",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "slice",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "counts",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AggregationCount",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "value",
                        "args": null,
                        "storageKey": null
                      },
                      (v7/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "count",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "FilterArtworksEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      (v2/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "image",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "aspectRatio",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "url",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "large"
                              }
                            ],
                            "storageKey": "url(version:\"large\")"
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "aspect_ratio",
                            "name": "aspectRatio",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      (v3/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "date",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "sale_message",
                        "name": "saleMessage",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "is_biddable",
                        "name": "isBiddable",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "is_acquireable",
                        "name": "isAcquireable",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "is_offerable",
                        "name": "isOfferable",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "sale",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Sale",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": "is_auction",
                            "name": "isAuction",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "is_closed",
                            "name": "isClosed",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "display_timely_at",
                            "name": "displayTimelyAt",
                            "args": null,
                            "storageKey": null
                          },
                          (v1/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": "sale_artwork",
                        "name": "saleArtwork",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": "current_bid",
                            "name": "currentBid",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "SaleArtworkCurrentBid",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "display",
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          },
                          (v1/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artists",
                        "storageKey": "artists(shallow:true)",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "shallow",
                            "value": true
                          }
                        ],
                        "concreteType": "Artist",
                        "plural": true,
                        "selections": (v8/*: any*/)
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Partner",
                        "plural": false,
                        "selections": (v8/*: any*/)
                      },
                      (v9/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "__typename",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "cursor",
                    "args": null,
                    "storageKey": null
                  },
                  (v1/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pageInfo",
                "storageKey": null,
                "args": null,
                "concreteType": "PageInfo",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "hasNextPage",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "startCursor",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "endCursor",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              (v1/*: any*/)
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "collectionArtworks",
            "name": "artworksConnection",
            "args": (v6/*: any*/),
            "handle": "connection",
            "key": "Collection_collectionArtworks",
            "filters": [
              "sort",
              "medium",
              "aggregations",
              "priceRange"
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artworksConnection",
            "storageKey": "artworksConnection(aggregations:[\"MERCHANDISABLE_ARTISTS\"],size:0,sort:\"-decayed_merch\")",
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
              (v4/*: any*/)
            ],
            "concreteType": "FilterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "merchandisableArtists",
                "storageKey": "merchandisableArtists(size:4)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "size",
                    "value": 4
                  }
                ],
                "concreteType": "Artist",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "internalID",
                    "args": null,
                    "storageKey": null
                  },
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v7/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "initials",
                    "args": null,
                    "storageKey": null
                  },
                  (v9/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": "is_followed",
                    "name": "isFollowed",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "nationality",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "birthday",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "deathday",
                    "args": null,
                    "storageKey": null
                  },
                  (v10/*: any*/)
                ]
              },
              (v1/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "query",
            "storageKey": null,
            "args": null,
            "concreteType": "MarketingCollectionQuery",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "artistIDs",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/)
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "featuredArtistExclusionIds",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "linkedCollections",
            "storageKey": null,
            "args": null,
            "concreteType": "MarketingCollectionGroup",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "groupType",
                "args": null,
                "storageKey": null
              },
              (v7/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "members",
                "storageKey": null,
                "args": null,
                "concreteType": "MarketingCollection",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "priceGuidance",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "artworksConnection",
                    "storageKey": "artworksConnection(aggregations:[\"TOTAL\"],first:3,sort:\"-decayed_merch\")",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "aggregations",
                        "value": [
                          "TOTAL"
                        ]
                      },
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 3
                      },
                      (v4/*: any*/)
                    ],
                    "concreteType": "FilterArtworksConnection",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "edges",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "FilterArtworksEdge",
                        "plural": true,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "node",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "plural": false,
                            "selections": [
                              (v3/*: any*/),
                              (v10/*: any*/),
                              (v1/*: any*/)
                            ]
                          }
                        ]
                      },
                      (v1/*: any*/)
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": "defaultHeader",
                    "name": "artworksConnection",
                    "storageKey": "artworksConnection(first:1,sort:\"-decayed_merch\")",
                    "args": (v5/*: any*/),
                    "concreteType": "FilterArtworksConnection",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "edges",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "FilterArtworksEdge",
                        "plural": true,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "node",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "plural": false,
                            "selections": [
                              (v10/*: any*/),
                              (v1/*: any*/)
                            ]
                          }
                        ]
                      },
                      (v1/*: any*/)
                    ]
                  },
                  (v1/*: any*/)
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CollectionTestsQuery",
    "id": "d55fc3af0598692ee5f02d2f7acceaf0",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "marketingCollection": {
          "type": "MarketingCollection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.id": (v11/*: any*/),
        "marketingCollection.slug": (v12/*: any*/),
        "marketingCollection.isDepartment": (v13/*: any*/),
        "marketingCollection.linkedCollections": {
          "type": "MarketingCollectionGroup",
          "enumValues": null,
          "plural": true,
          "nullable": false
        },
        "marketingCollection.title": (v12/*: any*/),
        "marketingCollection.headerImage": (v14/*: any*/),
        "marketingCollection.descriptionMarkdown": (v14/*: any*/),
        "marketingCollection.image": (v15/*: any*/),
        "marketingCollection.collectionArtworks": (v15/*: any*/),
        "marketingCollection.artworksConnection": (v15/*: any*/),
        "marketingCollection.query": {
          "type": "MarketingCollectionQuery",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "marketingCollection.featuredArtistExclusionIds": (v16/*: any*/),
        "marketingCollection.image.edges": (v17/*: any*/),
        "marketingCollection.image.id": (v18/*: any*/),
        "marketingCollection.collectionArtworks.counts": {
          "type": "FilterArtworksCounts",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.aggregations": {
          "type": "ArtworksAggregationResults",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges": {
          "type": "ArtworkEdgeInterface",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.pageInfo": {
          "type": "PageInfo",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "marketingCollection.collectionArtworks.id": (v18/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists": (v19/*: any*/),
        "marketingCollection.artworksConnection.id": (v18/*: any*/),
        "marketingCollection.query.artistIDs": (v16/*: any*/),
        "marketingCollection.query.id": (v18/*: any*/),
        "marketingCollection.linkedCollections.groupType": {
          "type": "MarketingGroupTypes",
          "enumValues": [
            "ArtistSeries",
            "FeaturedCollections",
            "OtherCollections"
          ],
          "plural": false,
          "nullable": false
        },
        "marketingCollection.image.edges.node": (v20/*: any*/),
        "marketingCollection.collectionArtworks.counts.total": {
          "type": "FormattedNumber",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.aggregations.slice": {
          "type": "ArtworkAggregation",
          "enumValues": [
            "COLOR",
            "DIMENSION_RANGE",
            "FOLLOWED_ARTISTS",
            "MAJOR_PERIOD",
            "MEDIUM",
            "MERCHANDISABLE_ARTISTS",
            "GALLERY",
            "INSTITUTION",
            "PARTNER_CITY",
            "PERIOD",
            "PRICE_RANGE",
            "TOTAL"
          ],
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.aggregations.counts": {
          "type": "AggregationCount",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node": (v20/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.internalID": (v11/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.id": (v11/*: any*/),
        "marketingCollection.linkedCollections.name": (v12/*: any*/),
        "marketingCollection.linkedCollections.members": {
          "type": "MarketingCollection",
          "enumValues": null,
          "plural": true,
          "nullable": false
        },
        "marketingCollection.image.edges.node.image": (v21/*: any*/),
        "marketingCollection.image.edges.node.id": (v18/*: any*/),
        "marketingCollection.collectionArtworks.aggregations.counts.value": (v12/*: any*/),
        "marketingCollection.collectionArtworks.aggregations.counts.name": (v12/*: any*/),
        "marketingCollection.collectionArtworks.aggregations.counts.count": {
          "type": "Int",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "marketingCollection.collectionArtworks.edges.node.id": (v11/*: any*/),
        "marketingCollection.collectionArtworks.edges.cursor": (v12/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo.hasNextPage": (v13/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo.startCursor": (v14/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo.endCursor": (v14/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.slug": (v11/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.name": (v14/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.initials": (v14/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.href": (v14/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.is_followed": (v22/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.nationality": (v14/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.birthday": (v14/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.deathday": (v14/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.image": (v21/*: any*/),
        "marketingCollection.linkedCollections.members.slug": (v12/*: any*/),
        "marketingCollection.linkedCollections.members.title": (v12/*: any*/),
        "marketingCollection.linkedCollections.members.priceGuidance": {
          "type": "Float",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.linkedCollections.members.artworksConnection": (v15/*: any*/),
        "marketingCollection.linkedCollections.members.defaultHeader": (v15/*: any*/),
        "marketingCollection.linkedCollections.members.id": (v18/*: any*/),
        "marketingCollection.image.edges.node.image.url": (v14/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.__typename": (v12/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.slug": (v11/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image": (v21/*: any*/),
        "marketingCollection.collectionArtworks.edges.id": (v18/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.image.url": (v14/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges": (v17/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.id": (v18/*: any*/),
        "marketingCollection.linkedCollections.members.defaultHeader.edges": (v17/*: any*/),
        "marketingCollection.linkedCollections.members.defaultHeader.id": (v18/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.aspectRatio": (v23/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.title": (v14/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.date": (v14/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale_message": (v14/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.is_biddable": (v22/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.is_acquireable": (v22/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.is_offerable": (v22/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale": {
          "type": "Sale",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.sale_artwork": {
          "type": "SaleArtwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.artists": (v19/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner": {
          "type": "Partner",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.href": (v14/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node": (v20/*: any*/),
        "marketingCollection.linkedCollections.members.defaultHeader.edges.node": (v20/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.is_auction": (v22/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.is_closed": (v22/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.display_timely_at": (v14/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.id": (v18/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale_artwork.current_bid": {
          "type": "SaleArtworkCurrentBid",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.sale_artwork.id": (v18/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.url": (v14/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.aspect_ratio": (v23/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.artists.name": (v14/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.artists.id": (v18/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner.name": (v14/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner.id": (v18/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node.title": (v14/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node.image": (v21/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node.id": (v18/*: any*/),
        "marketingCollection.linkedCollections.members.defaultHeader.edges.node.image": (v21/*: any*/),
        "marketingCollection.linkedCollections.members.defaultHeader.edges.node.id": (v18/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale_artwork.current_bid.display": (v14/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node.image.url": (v14/*: any*/),
        "marketingCollection.linkedCollections.members.defaultHeader.edges.node.image.url": (v14/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = 'fbe5831179fb6d1e2f66b7360c128d63';
export default node;
