/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type QueryRenderersWorksForYouQueryVariables = {};
export type QueryRenderersWorksForYouQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"WorksForYou_query">;
};
export type QueryRenderersWorksForYouQuery = {
    readonly response: QueryRenderersWorksForYouQueryResponse;
    readonly variables: QueryRenderersWorksForYouQueryVariables;
};



/*
query QueryRenderersWorksForYouQuery {
  ...WorksForYou_query
}

fragment WorksForYou_query on Query {
  me {
    followsAndSaves {
      notifications: bundledArtworksByArtistConnection(sort: PUBLISHED_AT_DESC, first: 10) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            ...Notification_notification
            __typename
          }
          cursor
        }
      }
    }
    id
  }
}

fragment Notification_notification on FollowedArtistsArtworksGroup {
  summary
  artists
  artworks: artworksConnection(first: 10) {
    edges {
      node {
        artists(shallow: true) {
          href
          id
        }
        ...GenericGrid_artworks
        id
      }
    }
  }
  image {
    resized(height: 80, width: 80) {
      url
    }
  }
}

fragment GenericGrid_artworks on Artwork {
  id
  image {
    aspect_ratio: aspectRatio
  }
  ...ArtworkGridItem_artwork
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
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v1 = [
  (v0/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "PUBLISHED_AT_DESC"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersWorksForYouQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "FragmentSpread",
        "name": "WorksForYou_query",
        "args": null
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersWorksForYouQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "followsAndSaves",
            "storageKey": null,
            "args": null,
            "concreteType": "FollowsAndSaves",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": "notifications",
                "name": "bundledArtworksByArtistConnection",
                "storageKey": "bundledArtworksByArtistConnection(first:10,sort:\"PUBLISHED_AT_DESC\")",
                "args": (v1/*: any*/),
                "concreteType": "FollowedArtistsArtworksGroupConnection",
                "plural": false,
                "selections": [
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
                        "name": "endCursor",
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
                    "concreteType": "FollowedArtistsArtworksGroupEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "FollowedArtistsArtworksGroup",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "summary",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "artists",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": "artworks",
                            "name": "artworksConnection",
                            "storageKey": "artworksConnection(first:10)",
                            "args": [
                              (v0/*: any*/)
                            ],
                            "concreteType": "ArtworkConnection",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "edges",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "ArtworkEdge",
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
                                        "selections": [
                                          (v3/*: any*/),
                                          (v2/*: any*/),
                                          (v4/*: any*/)
                                        ]
                                      },
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
                                            "alias": "aspect_ratio",
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
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "title",
                                        "args": null,
                                        "storageKey": null
                                      },
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
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "slug",
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
                                          (v2/*: any*/)
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
                                          (v2/*: any*/)
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
                                          (v4/*: any*/),
                                          (v2/*: any*/)
                                        ]
                                      },
                                      (v3/*: any*/)
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
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
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "resized",
                                "storageKey": "resized(height:80,width:80)",
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "height",
                                    "value": 80
                                  },
                                  {
                                    "kind": "Literal",
                                    "name": "width",
                                    "value": 80
                                  }
                                ],
                                "concreteType": "ResizedImageUrl",
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
                              }
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
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": "notifications",
                "name": "bundledArtworksByArtistConnection",
                "args": (v1/*: any*/),
                "handle": "connection",
                "key": "WorksForYou_notifications",
                "filters": [
                  "sort"
                ]
              }
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "QueryRenderersWorksForYouQuery",
    "id": "6882bc1c8166b63b8ef717e7a54f20fe",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'f21c288ba12dfb18c28347c8b57bc59e';
export default node;
