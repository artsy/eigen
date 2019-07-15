/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { WorksForYou_viewer$ref } from "./WorksForYou_viewer.graphql";
export type WorksForYouQueryVariables = {
    readonly count: number;
    readonly cursor?: string | null;
};
export type WorksForYouQueryResponse = {
    readonly viewer: {
        readonly " $fragmentRefs": WorksForYou_viewer$ref;
    } | null;
};
export type WorksForYouQuery = {
    readonly response: WorksForYouQueryResponse;
    readonly variables: WorksForYouQueryVariables;
};



/*
query WorksForYouQuery(
  $count: Int!
  $cursor: String
) {
  viewer {
    ...WorksForYou_viewer_1G22uz
  }
}

fragment WorksForYou_viewer_1G22uz on Viewer {
  me {
    followsAndSaves {
      notifications: bundledArtworksByArtist(sort: PUBLISHED_AT_DESC, first: $count, after: $cursor) {
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
  selectedArtist: artist(id: "") {
    slug
    href
    name
    image {
      resized(height: 80, width: 80) {
        url
      }
    }
    artworks(sort: PUBLISHED_AT_DESC, size: 6) {
      ...GenericGrid_artworks
      id
    }
    id
  }
}

fragment Notification_notification on FollowedArtistsArtworksGroup {
  summary
  artists
  artworks {
    artists(shallow: true) {
      href
      id
    }
    ...GenericGrid_artworks
    id
  }
  image {
    resized(height: 80, width: 80) {
      url
    }
  }
}

fragment GenericGrid_artworks on Artwork {
  id
  slug
  image {
    aspect_ratio
  }
  ...ArtworkGridItem_artwork
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  sale_message
  is_in_auction
  is_biddable
  is_acquireable
  is_offerable
  slug
  sale {
    is_auction
    is_live_open
    is_open
    is_closed
    display_timely_at
    id
  }
  sale_artwork {
    current_bid {
      display
    }
    id
  }
  image {
    url(version: "large")
    aspect_ratio
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
    "name": "count",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "cursor",
    "type": "String",
    "defaultValue": null
  }
],
v1 = {
  "kind": "Literal",
  "name": "sort",
  "value": "PUBLISHED_AT_DESC"
},
v2 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  (v1/*: any*/)
],
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = [
  {
    "kind": "Literal",
    "name": "shallow",
    "value": true
  }
],
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
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
      "alias": null,
      "name": "aspect_ratio",
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
  "alias": null,
  "name": "sale_message",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_in_auction",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_biddable",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_acquireable",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_offerable",
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
      "alias": null,
      "name": "is_auction",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_live_open",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_open",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_closed",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "display_timely_at",
      "args": null,
      "storageKey": null
    },
    (v3/*: any*/)
  ]
},
v17 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "sale_artwork",
  "storageKey": null,
  "args": null,
  "concreteType": "SaleArtwork",
  "plural": false,
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "current_bid",
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
    (v3/*: any*/)
  ]
},
v18 = [
  (v6/*: any*/),
  (v3/*: any*/)
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
    "name": "WorksForYouQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "WorksForYou_viewer",
            "args": [
              {
                "kind": "Variable",
                "name": "count",
                "variableName": "count"
              },
              {
                "kind": "Variable",
                "name": "cursor",
                "variableName": "cursor"
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "WorksForYouQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
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
                    "name": "bundledArtworksByArtist",
                    "storageKey": null,
                    "args": (v2/*: any*/),
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
                              (v3/*: any*/),
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
                                "alias": null,
                                "name": "artworks",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "Artwork",
                                "plural": true,
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "artists",
                                    "storageKey": "artists(shallow:true)",
                                    "args": (v4/*: any*/),
                                    "concreteType": "Artist",
                                    "plural": true,
                                    "selections": [
                                      (v5/*: any*/),
                                      (v3/*: any*/),
                                      (v6/*: any*/)
                                    ]
                                  },
                                  (v3/*: any*/),
                                  (v7/*: any*/),
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
                                  (v5/*: any*/)
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
                    "name": "bundledArtworksByArtist",
                    "args": (v2/*: any*/),
                    "handle": "connection",
                    "key": "WorksForYou_notifications",
                    "filters": [
                      "sort"
                    ]
                  }
                ]
              },
              (v3/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "selectedArtist",
            "name": "artist",
            "storageKey": "artist(id:\"\")",
            "args": [
              {
                "kind": "Literal",
                "name": "id",
                "value": ""
              }
            ],
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              (v7/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v20/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "artworks",
                "storageKey": "artworks(size:6,sort:\"PUBLISHED_AT_DESC\")",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "size",
                    "value": 6
                  },
                  (v1/*: any*/)
                ],
                "concreteType": "Artwork",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v7/*: any*/),
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
                    "args": (v4/*: any*/),
                    "concreteType": "Artist",
                    "plural": true,
                    "selections": (v18/*: any*/)
                  },
                  (v19/*: any*/),
                  (v5/*: any*/)
                ]
              },
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "WorksForYouQuery",
    "id": "67ec5613f91d61c274ed2c5432536330",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'cdaed0d06ebf1989bb6ad7ef67258acd';
export default node;
