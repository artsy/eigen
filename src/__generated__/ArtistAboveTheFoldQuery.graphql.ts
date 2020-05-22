/* tslint:disable */
/* eslint-disable */
/* @relayHash 8028186f3a5a452d41eac6ce3313529b */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistAboveTheFoldQueryVariables = {
    artistID: string;
};
export type ArtistAboveTheFoldQueryResponse = {
    readonly artist: {
        readonly internalID: string;
        readonly slug: string;
        readonly has_metadata: boolean | null;
        readonly counts: {
            readonly artworks: number | null;
            readonly partner_shows: number | null;
            readonly related_artists: number | null;
            readonly articles: number | null;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"ArtistHeader_artist" | "ArtistArtworks_artist">;
    } | null;
};
export type ArtistAboveTheFoldQuery = {
    readonly response: ArtistAboveTheFoldQueryResponse;
    readonly variables: ArtistAboveTheFoldQueryVariables;
};



/*
query ArtistAboveTheFoldQuery(
  $artistID: String!
) {
  artist(id: $artistID) {
    internalID
    slug
    has_metadata: hasMetadata
    counts {
      artworks
      partner_shows: partnerShows
      related_artists: relatedArtists
      articles
    }
    ...ArtistHeader_artist
    ...ArtistArtworks_artist
    id
  }
}

fragment ArtistArtworks_artist on Artist {
  id
  slug
  internalID
  artworks: filterArtworksConnection(first: 10, sort: "-decayed_merch", medium: "*", dimensionRange: "*-*", acquireable: true, inquireableOnly: true, atAuction: true, offerable: true, aggregations: [TOTAL]) {
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

fragment ArtistHeader_artist on Artist {
  id
  internalID
  slug
  isFollowed
  name
  nationality
  birthday
  counts {
    follows
  }
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  saleMessage
  slug
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
    "kind": "LocalArgument",
    "name": "artistID",
    "type": "String!",
    "defaultValue": null
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
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": "has_metadata",
  "name": "hasMetadata",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artworks",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": "partner_shows",
  "name": "partnerShows",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": "related_artists",
  "name": "relatedArtists",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "articles",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "Literal",
  "name": "aggregations",
  "value": [
    "TOTAL"
  ]
},
v12 = {
  "kind": "Literal",
  "name": "sort",
  "value": "-decayed_merch"
},
v13 = [
  {
    "kind": "Literal",
    "name": "acquireable",
    "value": true
  },
  (v11/*: any*/),
  {
    "kind": "Literal",
    "name": "atAuction",
    "value": true
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
    "name": "inquireableOnly",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "medium",
    "value": "*"
  },
  {
    "kind": "Literal",
    "name": "offerable",
    "value": true
  },
  (v12/*: any*/)
],
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistAboveTheFoldQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtistCounts",
            "plural": false,
            "selections": [
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/)
            ]
          },
          {
            "kind": "FragmentSpread",
            "name": "ArtistHeader_artist",
            "args": null
          },
          {
            "kind": "FragmentSpread",
            "name": "ArtistArtworks_artist",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistAboveTheFoldQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtistCounts",
            "plural": false,
            "selections": [
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "follows",
                "args": null,
                "storageKey": null
              }
            ]
          },
          (v9/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isFollowed",
            "args": null,
            "storageKey": null
          },
          (v10/*: any*/),
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
            "kind": "LinkedField",
            "alias": "artworks",
            "name": "filterArtworksConnection",
            "storageKey": "filterArtworksConnection(acquireable:true,aggregations:[\"TOTAL\"],atAuction:true,dimensionRange:\"*-*\",first:10,inquireableOnly:true,medium:\"*\",offerable:true,sort:\"-decayed_merch\")",
            "args": (v13/*: any*/),
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
                      (v9/*: any*/),
                      (v3/*: any*/),
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
                      (v14/*: any*/),
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
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "artistNames",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "href",
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
                          (v9/*: any*/)
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
                          (v9/*: any*/)
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
                          (v10/*: any*/),
                          (v9/*: any*/)
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
                  (v9/*: any*/)
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
              (v9/*: any*/)
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "artworks",
            "name": "filterArtworksConnection",
            "args": (v13/*: any*/),
            "handle": "connection",
            "key": "ArtistArtworksGrid_artworks",
            "filters": [
              "sort",
              "medium",
              "priceRange",
              "color",
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
            "alias": "iconicCollections",
            "name": "marketingCollections",
            "storageKey": "marketingCollections(isFeaturedArtistContent:true,size:16)",
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
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v9/*: any*/),
              (v14/*: any*/),
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
                  (v11/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 3
                  },
                  (v12/*: any*/)
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
                          (v14/*: any*/),
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
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          },
                          (v9/*: any*/)
                        ]
                      }
                    ]
                  },
                  (v9/*: any*/)
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
    "name": "ArtistAboveTheFoldQuery",
    "id": "4dfbb16b5347d8114e29fac1bb628042",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'cdb232e43a7ddd5a35a5a993179f8e34';
export default node;
