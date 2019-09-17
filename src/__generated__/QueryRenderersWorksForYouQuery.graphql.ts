/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { WorksForYou_query$ref } from "./WorksForYou_query.graphql";
export type QueryRenderersWorksForYouQueryVariables = {
    readonly selectedArtist: string;
};
export type QueryRenderersWorksForYouQueryResponse = {
    readonly " $fragmentRefs": WorksForYou_query$ref;
};
export type QueryRenderersWorksForYouQuery = {
    readonly response: QueryRenderersWorksForYouQueryResponse;
    readonly variables: QueryRenderersWorksForYouQueryVariables;
};



/*
query QueryRenderersWorksForYouQuery(
  $selectedArtist: String!
) {
  ...WorksForYou_query_2hRnfI
}

fragment WorksForYou_query_2hRnfI on Query {
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
  selectedArtist: artist(id: $selectedArtist) {
    slug
    href
    name
    image {
      resized(height: 80, width: 80) {
        url
      }
    }
    artworks: artworksConnection(sort: PUBLISHED_AT_DESC, first: 6) {
      edges {
        node {
          ...GenericGrid_artworks
          id
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
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "selectedArtist",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v2 = {
  "kind": "Literal",
  "name": "sort",
  "value": "PUBLISHED_AT_DESC"
},
v3 = [
  (v1/*: any*/),
  (v2/*: any*/)
],
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v5 = [
  {
    "kind": "Literal",
    "name": "shallow",
    "value": true
  }
],
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v8 = {
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
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "date",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": "sale_message",
  "name": "saleMessage",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": "is_biddable",
  "name": "isBiddable",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "ScalarField",
  "alias": "is_acquireable",
  "name": "isAcquireable",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": "is_offerable",
  "name": "isOfferable",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v16 = {
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
    (v4/*: any*/)
  ]
},
v17 = {
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
    (v4/*: any*/)
  ]
},
v18 = [
  (v7/*: any*/),
  (v4/*: any*/)
],
v19 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": (v18/*: any*/)
},
v20 = {
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
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersWorksForYouQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "FragmentSpread",
        "name": "WorksForYou_query",
        "args": [
          {
            "kind": "Variable",
            "name": "selectedArtist",
            "variableName": "selectedArtist"
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersWorksForYouQuery",
    "argumentDefinitions": (v0/*: any*/),
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
                "args": (v3/*: any*/),
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
                          (v4/*: any*/),
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
                              (v1/*: any*/)
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
                                        "args": (v5/*: any*/),
                                        "concreteType": "Artist",
                                        "plural": true,
                                        "selections": [
                                          (v6/*: any*/),
                                          (v4/*: any*/),
                                          (v7/*: any*/)
                                        ]
                                      },
                                      (v4/*: any*/),
                                      (v8/*: any*/),
                                      (v9/*: any*/),
                                      (v10/*: any*/),
                                      (v11/*: any*/),
                                      (v12/*: any*/),
                                      (v13/*: any*/),
                                      (v14/*: any*/),
                                      (v15/*: any*/),
                                      (v16/*: any*/),
                                      (v17/*: any*/),
                                      (v19/*: any*/),
                                      (v6/*: any*/)
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          (v20/*: any*/),
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
                "args": (v3/*: any*/),
                "handle": "connection",
                "key": "WorksForYou_notifications",
                "filters": [
                  "sort"
                ]
              }
            ]
          },
          (v4/*: any*/)
        ]
      },
      {
        "kind": "LinkedField",
        "alias": "selectedArtist",
        "name": "artist",
        "storageKey": null,
        "args": [
          {
            "kind": "Variable",
            "name": "id",
            "variableName": "selectedArtist"
          }
        ],
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          (v15/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v20/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "artworks",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(first:6,sort:\"PUBLISHED_AT_DESC\")",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 6
              },
              (v2/*: any*/)
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
                      (v4/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artists",
                        "storageKey": "artists(shallow:true)",
                        "args": (v5/*: any*/),
                        "concreteType": "Artist",
                        "plural": true,
                        "selections": (v18/*: any*/)
                      },
                      (v19/*: any*/),
                      (v6/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          (v4/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "QueryRenderersWorksForYouQuery",
    "id": "53627c5acf2d8fe8e5b9f8887a9a7333",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '91e78d7c0386171afd2c033cd9431e8d';
export default node;
