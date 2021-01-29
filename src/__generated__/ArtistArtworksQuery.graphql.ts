/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 353c24cb19397d74957101b29a6369b8 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistArtworksQueryVariables = {
    id: string;
    count: number;
    cursor?: string | null;
    sort?: string | null;
    medium?: string | null;
    priceRange?: string | null;
    color?: string | null;
    partnerID?: string | null;
    dimensionRange?: string | null;
    majorPeriods?: Array<string | null> | null;
    acquireable?: boolean | null;
    inquireableOnly?: boolean | null;
    atAuction?: boolean | null;
    offerable?: boolean | null;
    attributionClass?: Array<string | null> | null;
};
export type ArtistArtworksQueryResponse = {
    readonly node: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistArtworks_artist">;
    } | null;
};
export type ArtistArtworksQuery = {
    readonly response: ArtistArtworksQueryResponse;
    readonly variables: ArtistArtworksQueryVariables;
};



/*
query ArtistArtworksQuery(
  $id: ID!
  $count: Int!
  $cursor: String
  $sort: String
  $medium: String
  $priceRange: String
  $color: String
  $partnerID: ID
  $dimensionRange: String
  $majorPeriods: [String]
  $acquireable: Boolean
  $inquireableOnly: Boolean
  $atAuction: Boolean
  $offerable: Boolean
  $attributionClass: [String]
) {
  node(id: $id) {
    __typename
    ... on Artist {
      ...ArtistArtworks_artist_3FXTiz
    }
    id
  }
}

fragment ArtistArtworks_artist_3FXTiz on Artist {
  id
  slug
  internalID
  artworks: filterArtworksConnection(first: $count, after: $cursor, sort: $sort, medium: $medium, priceRange: $priceRange, color: $color, partnerID: $partnerID, dimensionRange: $dimensionRange, majorPeriods: $majorPeriods, acquireable: $acquireable, inquireableOnly: $inquireableOnly, atAuction: $atAuction, offerable: $offerable, aggregations: [COLOR, DIMENSION_RANGE, GALLERY, INSTITUTION, MAJOR_PERIOD, MEDIUM, PRICE_RANGE], attributionClass: $attributionClass) {
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
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
    id
  }
  ...ArtistCollectionsRail_artist
  iconicCollections: marketingCollections(isFeaturedArtistContent: true, size: 16) {
    ...ArtistCollectionsRail_collections
    id
  }
  ...ArtistNotableWorksRail_artist
  ...ArtistSeriesMoreSeries_artist
  notableWorks: filterArtworksConnection(sort: "-weighted_iconicity", first: 3) {
    edges {
      node {
        id
      }
    }
    id
  }
}

fragment ArtistCollectionsRail_artist on Artist {
  internalID
  slug
}

fragment ArtistCollectionsRail_collections on MarketingCollection {
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

fragment ArtistNotableWorksRail_artist on Artist {
  filterArtworksConnection(sort: "-weighted_iconicity", first: 10) {
    edges {
      node {
        id
        image {
          imageURL
          aspectRatio
        }
        saleMessage
        saleArtwork {
          openingBid {
            display
          }
          highestBid {
            display
          }
          id
        }
        sale {
          isClosed
          isAuction
          id
        }
        title
        internalID
        slug
      }
    }
    id
  }
}

fragment ArtistSeriesMoreSeries_artist on Artist {
  internalID
  artistSeriesConnection(first: 4) {
    totalCount
    edges {
      node {
        slug
        internalID
        title
        featured
        artworksCountMessage
        image {
          url
        }
      }
    }
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
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "acquireable"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "atAuction"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "attributionClass"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "color"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cursor"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "dimensionRange"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "inquireableOnly"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "majorPeriods"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "medium"
},
v11 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "offerable"
},
v12 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "partnerID"
},
v13 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "priceRange"
},
v14 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sort"
},
v15 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v16 = {
  "kind": "Variable",
  "name": "acquireable",
  "variableName": "acquireable"
},
v17 = {
  "kind": "Variable",
  "name": "atAuction",
  "variableName": "atAuction"
},
v18 = {
  "kind": "Variable",
  "name": "attributionClass",
  "variableName": "attributionClass"
},
v19 = {
  "kind": "Variable",
  "name": "color",
  "variableName": "color"
},
v20 = {
  "kind": "Variable",
  "name": "dimensionRange",
  "variableName": "dimensionRange"
},
v21 = {
  "kind": "Variable",
  "name": "inquireableOnly",
  "variableName": "inquireableOnly"
},
v22 = {
  "kind": "Variable",
  "name": "majorPeriods",
  "variableName": "majorPeriods"
},
v23 = {
  "kind": "Variable",
  "name": "medium",
  "variableName": "medium"
},
v24 = {
  "kind": "Variable",
  "name": "offerable",
  "variableName": "offerable"
},
v25 = {
  "kind": "Variable",
  "name": "partnerID",
  "variableName": "partnerID"
},
v26 = {
  "kind": "Variable",
  "name": "priceRange",
  "variableName": "priceRange"
},
v27 = {
  "kind": "Variable",
  "name": "sort",
  "variableName": "sort"
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v32 = [
  (v16/*: any*/),
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
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
  (v17/*: any*/),
  (v18/*: any*/),
  (v19/*: any*/),
  (v20/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  (v21/*: any*/),
  (v22/*: any*/),
  (v23/*: any*/),
  (v24/*: any*/),
  (v25/*: any*/),
  (v26/*: any*/),
  (v27/*: any*/)
],
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "aspectRatio",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleMessage",
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAuction",
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isClosed",
  "storageKey": null
},
v39 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v40 = [
  (v29/*: any*/)
],
v41 = {
  "kind": "Literal",
  "name": "first",
  "value": 3
},
v42 = {
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
      "name": "url",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v43 = {
  "kind": "Literal",
  "name": "sort",
  "value": "-weighted_iconicity"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/),
      (v13/*: any*/),
      (v14/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistArtworksQuery",
    "selections": [
      {
        "alias": null,
        "args": (v15/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": [
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/),
                  {
                    "kind": "Variable",
                    "name": "count",
                    "variableName": "count"
                  },
                  {
                    "kind": "Variable",
                    "name": "cursor",
                    "variableName": "cursor"
                  },
                  (v20/*: any*/),
                  (v21/*: any*/),
                  (v22/*: any*/),
                  (v23/*: any*/),
                  (v24/*: any*/),
                  (v25/*: any*/),
                  (v26/*: any*/),
                  (v27/*: any*/)
                ],
                "kind": "FragmentSpread",
                "name": "ArtistArtworks_artist"
              }
            ],
            "type": "Artist",
            "abstractKey": null
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
    "argumentDefinitions": [
      (v7/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v14/*: any*/),
      (v10/*: any*/),
      (v13/*: any*/),
      (v3/*: any*/),
      (v12/*: any*/),
      (v6/*: any*/),
      (v9/*: any*/),
      (v0/*: any*/),
      (v8/*: any*/),
      (v1/*: any*/),
      (v11/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "ArtistArtworksQuery",
    "selections": [
      {
        "alias": null,
        "args": (v15/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v28/*: any*/),
          (v29/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v30/*: any*/),
              (v31/*: any*/),
              {
                "alias": "artworks",
                "args": (v32/*: any*/),
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
                          (v33/*: any*/),
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
                          (v29/*: any*/),
                          (v28/*: any*/)
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
                  (v29/*: any*/),
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
                          (v28/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v30/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Image",
                                "kind": "LinkedField",
                                "name": "image",
                                "plural": false,
                                "selections": [
                                  (v34/*: any*/),
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
                              (v35/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "date",
                                "storageKey": null
                              },
                              (v36/*: any*/),
                              (v31/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "artistNames",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "href",
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
                                  (v37/*: any*/),
                                  (v38/*: any*/),
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
                                  (v29/*: any*/)
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
                                    "selections": (v39/*: any*/),
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "lotLabel",
                                    "storageKey": null
                                  },
                                  (v29/*: any*/)
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
                                  (v33/*: any*/),
                                  (v29/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": (v40/*: any*/),
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
                "storageKey": null
              },
              {
                "alias": "artworks",
                "args": (v32/*: any*/),
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
                  "aggregations",
                  "attributionClass"
                ],
                "handle": "connection",
                "key": "ArtistArtworksGrid_artworks",
                "kind": "LinkedHandle",
                "name": "filterArtworksConnection"
              },
              {
                "alias": "iconicCollections",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "isFeaturedArtistContent",
                    "value": true
                  },
                  {
                    "kind": "Literal",
                    "name": "size",
                    "value": 16
                  }
                ],
                "concreteType": "MarketingCollection",
                "kind": "LinkedField",
                "name": "marketingCollections",
                "plural": true,
                "selections": [
                  (v30/*: any*/),
                  (v29/*: any*/),
                  (v35/*: any*/),
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
                      {
                        "kind": "Literal",
                        "name": "aggregations",
                        "value": [
                          "TOTAL"
                        ]
                      },
                      (v41/*: any*/),
                      {
                        "kind": "Literal",
                        "name": "sort",
                        "value": "-decayed_merch"
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
                              (v35/*: any*/),
                              (v42/*: any*/),
                              (v29/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v29/*: any*/)
                    ],
                    "storageKey": "artworksConnection(aggregations:[\"TOTAL\"],first:3,sort:\"-decayed_merch\")"
                  }
                ],
                "storageKey": "marketingCollections(isFeaturedArtistContent:true,size:16)"
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 10
                  },
                  (v43/*: any*/)
                ],
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
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v29/*: any*/),
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
                                "name": "imageURL",
                                "storageKey": null
                              },
                              (v34/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v36/*: any*/),
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
                                "concreteType": "SaleArtworkOpeningBid",
                                "kind": "LinkedField",
                                "name": "openingBid",
                                "plural": false,
                                "selections": (v39/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "SaleArtworkHighestBid",
                                "kind": "LinkedField",
                                "name": "highestBid",
                                "plural": false,
                                "selections": (v39/*: any*/),
                                "storageKey": null
                              },
                              (v29/*: any*/)
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
                              (v38/*: any*/),
                              (v37/*: any*/),
                              (v29/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v35/*: any*/),
                          (v31/*: any*/),
                          (v30/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v29/*: any*/)
                ],
                "storageKey": "filterArtworksConnection(first:10,sort:\"-weighted_iconicity\")"
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 4
                  }
                ],
                "concreteType": "ArtistSeriesConnection",
                "kind": "LinkedField",
                "name": "artistSeriesConnection",
                "plural": false,
                "selections": [
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
                    "concreteType": "ArtistSeriesEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ArtistSeries",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v30/*: any*/),
                          (v31/*: any*/),
                          (v35/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "featured",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "artworksCountMessage",
                            "storageKey": null
                          },
                          (v42/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "artistSeriesConnection(first:4)"
              },
              {
                "alias": "notableWorks",
                "args": [
                  (v41/*: any*/),
                  (v43/*: any*/)
                ],
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
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": (v40/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v29/*: any*/)
                ],
                "storageKey": "filterArtworksConnection(first:3,sort:\"-weighted_iconicity\")"
              }
            ],
            "type": "Artist",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "353c24cb19397d74957101b29a6369b8",
    "metadata": {},
    "name": "ArtistArtworksQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '847fa3cef271f76f7b28bb9612468eb2';
export default node;
