/* tslint:disable */
/* eslint-disable */
/* @relayHash 5a962e6f39e5f93c40ad8edb970ca9af */

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
    id
  }
  saleArtwork {
    currentBid {
      display
    }
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

fragment CollectionArtworks_collection on MarketingCollection {
  isDepartment
  slug
  id
  collectionArtworks: artworksConnection(first: 10, sort: "-decayed_merch", medium: "*", dimensionRange: "*-*", aggregations: [COLOR, DIMENSION_RANGE, GALLERY, INSTITUTION, MAJOR_PERIOD, MEDIUM, PRICE_RANGE]) {
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
  ...CollectionArtworks_collection
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
  "kind": "ScalarField",
  "alias": null,
  "name": "descriptionMarkdown",
  "args": null,
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
      "COLOR",
      "DIMENSION_RANGE",
      "GALLERY",
      "INSTITUTION",
      "MAJOR_PERIOD",
      "MEDIUM",
      "PRICE_RANGE"
    ]
  },
  {
    "kind": "Literal",
    "name": "dimensionRange",
    "value": "*-*"
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
  (v6/*: any*/)
],
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v11 = {
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
v12 = {
  "kind": "Literal",
  "name": "aggregations",
  "value": [
    "TOTAL"
  ]
},
v13 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v14 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v15 = {
  "type": "Boolean",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v16 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v17 = {
  "type": "FilterArtworksConnection",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v18 = {
  "type": "String",
  "enumValues": null,
  "plural": true,
  "nullable": true
},
v19 = {
  "type": "FilterArtworksEdge",
  "enumValues": null,
  "plural": true,
  "nullable": true
},
v20 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v21 = {
  "type": "Artwork",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v22 = {
  "type": "Image",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v23 = {
  "type": "Boolean",
  "enumValues": null,
  "plural": false,
  "nullable": true
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
          (v4/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "image",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(first:1,sort:\"-decayed_merch\")",
            "args": [
              (v5/*: any*/),
              (v6/*: any*/)
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
            "storageKey": "artworksConnection(aggregations:[\"COLOR\",\"DIMENSION_RANGE\",\"GALLERY\",\"INSTITUTION\",\"MAJOR_PERIOD\",\"MEDIUM\",\"PRICE_RANGE\"],dimensionRange:\"*-*\",first:10,medium:\"*\",sort:\"-decayed_merch\")",
            "args": (v7/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "plural": false,
            "selections": [
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
                      (v8/*: any*/),
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
                        "alias": null,
                        "name": "saleMessage",
                        "args": null,
                        "storageKey": null
                      },
                      (v9/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "artistNames",
                        "args": null,
                        "storageKey": null
                      },
                      (v10/*: any*/),
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
                            "alias": null,
                            "name": "isAuction",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "isClosed",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "displayTimelyAt",
                            "args": null,
                            "storageKey": null
                          },
                          (v1/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "saleArtwork",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
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
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Partner",
                        "plural": false,
                        "selections": [
                          (v8/*: any*/),
                          (v1/*: any*/)
                        ]
                      },
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
            "args": (v7/*: any*/),
            "handle": "connection",
            "key": "Collection_collectionArtworks",
            "filters": [
              "sort",
              "medium",
              "priceRange",
              "color",
              "partnerID",
              "dimensionRange",
              "majorPeriods",
              "acquireable",
              "inquireableOnly",
              "atAuction",
              "offerable",
              "aggregations"
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
              (v6/*: any*/)
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
                  (v9/*: any*/),
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v8/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "initials",
                    "args": null,
                    "storageKey": null
                  },
                  (v10/*: any*/),
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
                  (v11/*: any*/)
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
              (v8/*: any*/),
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
                  (v1/*: any*/),
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
                      (v12/*: any*/),
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 3
                      },
                      (v6/*: any*/)
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
                              (v11/*: any*/),
                              (v1/*: any*/)
                            ]
                          }
                        ]
                      },
                      (v1/*: any*/)
                    ]
                  },
                  (v4/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": "featuredCollectionArtworks",
                    "name": "artworksConnection",
                    "storageKey": "artworksConnection(aggregations:[\"TOTAL\"],first:1,sort:\"-decayed_merch\")",
                    "args": [
                      (v12/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/)
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
                              (v11/*: any*/),
                              (v1/*: any*/)
                            ]
                          }
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
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CollectionTestsQuery",
    "id": "fbb05f86a347b9e116d0e1badbbea1d9",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "marketingCollection": {
          "type": "MarketingCollection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.id": (v13/*: any*/),
        "marketingCollection.slug": (v14/*: any*/),
        "marketingCollection.isDepartment": (v15/*: any*/),
        "marketingCollection.linkedCollections": {
          "type": "MarketingCollectionGroup",
          "enumValues": null,
          "plural": true,
          "nullable": false
        },
        "marketingCollection.title": (v14/*: any*/),
        "marketingCollection.headerImage": (v16/*: any*/),
        "marketingCollection.descriptionMarkdown": (v16/*: any*/),
        "marketingCollection.image": (v17/*: any*/),
        "marketingCollection.collectionArtworks": (v17/*: any*/),
        "marketingCollection.artworksConnection": (v17/*: any*/),
        "marketingCollection.query": {
          "type": "MarketingCollectionQuery",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "marketingCollection.featuredArtistExclusionIds": (v18/*: any*/),
        "marketingCollection.image.edges": (v19/*: any*/),
        "marketingCollection.image.id": (v20/*: any*/),
        "marketingCollection.collectionArtworks.aggregations": {
          "type": "ArtworksAggregationResults",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.counts": {
          "type": "FilterArtworksCounts",
          "enumValues": null,
          "plural": false,
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
        "marketingCollection.collectionArtworks.id": (v20/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists": {
          "type": "Artist",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "marketingCollection.artworksConnection.id": (v20/*: any*/),
        "marketingCollection.query.artistIDs": (v18/*: any*/),
        "marketingCollection.query.id": (v20/*: any*/),
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
        "marketingCollection.image.edges.node": (v21/*: any*/),
        "marketingCollection.collectionArtworks.aggregations.slice": {
          "type": "ArtworkAggregation",
          "enumValues": [
            "COLOR",
            "DIMENSION_RANGE",
            "FOLLOWED_ARTISTS",
            "GALLERY",
            "INSTITUTION",
            "MAJOR_PERIOD",
            "MEDIUM",
            "MERCHANDISABLE_ARTISTS",
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
        "marketingCollection.collectionArtworks.counts.total": {
          "type": "FormattedNumber",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node": (v21/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.internalID": (v13/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.id": (v13/*: any*/),
        "marketingCollection.linkedCollections.name": (v14/*: any*/),
        "marketingCollection.linkedCollections.members": {
          "type": "MarketingCollection",
          "enumValues": null,
          "plural": true,
          "nullable": false
        },
        "marketingCollection.image.edges.node.image": (v22/*: any*/),
        "marketingCollection.image.edges.node.id": (v20/*: any*/),
        "marketingCollection.collectionArtworks.aggregations.counts.value": (v14/*: any*/),
        "marketingCollection.collectionArtworks.aggregations.counts.name": (v14/*: any*/),
        "marketingCollection.collectionArtworks.aggregations.counts.count": {
          "type": "Int",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "marketingCollection.collectionArtworks.edges.node.id": (v13/*: any*/),
        "marketingCollection.collectionArtworks.edges.cursor": (v14/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo.hasNextPage": (v15/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo.startCursor": (v16/*: any*/),
        "marketingCollection.collectionArtworks.pageInfo.endCursor": (v16/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.slug": (v13/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.name": (v16/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.initials": (v16/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.href": (v16/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.is_followed": (v23/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.nationality": (v16/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.birthday": (v16/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.deathday": (v16/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.image": (v22/*: any*/),
        "marketingCollection.linkedCollections.members.slug": (v14/*: any*/),
        "marketingCollection.linkedCollections.members.id": (v13/*: any*/),
        "marketingCollection.linkedCollections.members.title": (v14/*: any*/),
        "marketingCollection.linkedCollections.members.priceGuidance": {
          "type": "Float",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.linkedCollections.members.artworksConnection": (v17/*: any*/),
        "marketingCollection.linkedCollections.members.descriptionMarkdown": (v16/*: any*/),
        "marketingCollection.linkedCollections.members.featuredCollectionArtworks": (v17/*: any*/),
        "marketingCollection.image.edges.node.image.url": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.__typename": (v14/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.slug": (v13/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image": (v22/*: any*/),
        "marketingCollection.collectionArtworks.edges.id": (v20/*: any*/),
        "marketingCollection.artworksConnection.merchandisableArtists.image.url": (v16/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges": (v19/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.id": (v20/*: any*/),
        "marketingCollection.linkedCollections.members.featuredCollectionArtworks.edges": (v19/*: any*/),
        "marketingCollection.linkedCollections.members.featuredCollectionArtworks.id": (v20/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.aspectRatio": {
          "type": "Float",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "marketingCollection.collectionArtworks.edges.node.title": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.date": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.saleMessage": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.internalID": (v13/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.artistNames": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.href": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale": {
          "type": "Sale",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.saleArtwork": {
          "type": "SaleArtwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.partner": {
          "type": "Partner",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node": (v21/*: any*/),
        "marketingCollection.linkedCollections.members.featuredCollectionArtworks.edges.node": (v21/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.isAuction": (v23/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.isClosed": (v23/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.displayTimelyAt": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.sale.id": (v20/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.saleArtwork.currentBid": {
          "type": "SaleArtworkCurrentBid",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketingCollection.collectionArtworks.edges.node.saleArtwork.id": (v20/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner.name": (v16/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.partner.id": (v20/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.image.url": (v16/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node.title": (v16/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node.image": (v22/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node.id": (v20/*: any*/),
        "marketingCollection.linkedCollections.members.featuredCollectionArtworks.edges.node.image": (v22/*: any*/),
        "marketingCollection.linkedCollections.members.featuredCollectionArtworks.edges.node.id": (v20/*: any*/),
        "marketingCollection.collectionArtworks.edges.node.saleArtwork.currentBid.display": (v16/*: any*/),
        "marketingCollection.linkedCollections.members.artworksConnection.edges.node.image.url": (v16/*: any*/),
        "marketingCollection.linkedCollections.members.featuredCollectionArtworks.edges.node.image.url": (v16/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = 'fbe5831179fb6d1e2f66b7360c128d63';
export default node;
