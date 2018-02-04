/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type QueryRenderersWorksForYouQueryVariables = {
    readonly selectedArtist: string;
};
export type QueryRenderersWorksForYouQueryResponse = {
    readonly viewer: ({
    }) | null;
};



/*
query QueryRenderersWorksForYouQuery(
  $selectedArtist: String!
) {
  viewer {
    ...WorksForYou_viewer_2hRnfI
  }
}

fragment WorksForYou_viewer_2hRnfI on Viewer {
  me {
    followsAndSaves {
      notifications: bundledArtworksByArtist(sort: PUBLISHED_AT_DESC, first: 10) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            __id
            ...Notification_notification
            __typename
          }
          cursor
        }
      }
    }
    __id
  }
  selectedArtist: artist(id: $selectedArtist) {
    href
    name
    image {
      resized(height: 80, width: 80) {
        url
      }
    }
    artworks(sort: published_at_desc, size: 6) {
      ...GenericGrid_artworks
      __id
    }
    __id
  }
}

fragment Notification_notification on FollowedArtistsArtworksGroup {
  summary
  artists
  artworks {
    artists(shallow: true) {
      href
      __id
    }
    ...GenericGrid_artworks
    __id
  }
  image {
    resized(height: 80, width: 80) {
      url
    }
  }
  __id
}

fragment GenericGrid_artworks on Artwork {
  __id
  id
  image {
    aspect_ratio
  }
  ...Artwork_artwork
}

fragment Artwork_artwork on Artwork {
  title
  date
  sale_message
  is_in_auction
  id
  sale_artwork {
    opening_bid {
      display
    }
    current_bid {
      display
    }
    bidder_positions_count
    sale {
      is_open
      __id
    }
    __id
  }
  image {
    url(version: "large")
    aspect_ratio
  }
  artists(shallow: true) {
    name
    __id
  }
  partner {
    name
    __id
  }
  href
  __id
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
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "date",
  "args": null,
  "storageKey": null
},
v3 = [
  {
    "kind": "Literal",
    "name": "shallow",
    "value": true,
    "type": "Boolean"
  }
],
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v7 = {
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
          "value": "large",
          "type": "[String]"
        }
      ],
      "storageKey": "url(version:\"large\")"
    }
  ]
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "sale_message",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_in_auction",
  "args": null,
  "storageKey": null
},
v11 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
],
v12 = {
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
      "name": "opening_bid",
      "storageKey": null,
      "args": null,
      "concreteType": "SaleArtworkOpeningBid",
      "plural": false,
      "selections": v11
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "current_bid",
      "storageKey": null,
      "args": null,
      "concreteType": "SaleArtworkCurrentBid",
      "plural": false,
      "selections": v11
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "bidder_positions_count",
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
          "name": "is_open",
          "args": null,
          "storageKey": null
        },
        v1
      ],
      "idField": "__id"
    },
    v1
  ],
  "idField": "__id"
},
v13 = [
  v5,
  v1
],
v14 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": v13,
  "idField": "__id"
},
v15 = {
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
          "value": 80,
          "type": "Int"
        },
        {
          "kind": "Literal",
          "name": "width",
          "value": 80,
          "type": "Int"
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
  "operationKind": "query",
  "name": "QueryRenderersWorksForYouQuery",
  "id": null,
  "text": "query QueryRenderersWorksForYouQuery(\n  $selectedArtist: String!\n) {\n  viewer {\n    ...WorksForYou_viewer_2hRnfI\n  }\n}\n\nfragment WorksForYou_viewer_2hRnfI on Viewer {\n  me {\n    followsAndSaves {\n      notifications: bundledArtworksByArtist(sort: PUBLISHED_AT_DESC, first: 10) {\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        edges {\n          node {\n            __id\n            ...Notification_notification\n            __typename\n          }\n          cursor\n        }\n      }\n    }\n    __id\n  }\n  selectedArtist: artist(id: $selectedArtist) {\n    href\n    name\n    image {\n      resized(height: 80, width: 80) {\n        url\n      }\n    }\n    artworks(sort: published_at_desc, size: 6) {\n      ...GenericGrid_artworks\n      __id\n    }\n    __id\n  }\n}\n\nfragment Notification_notification on FollowedArtistsArtworksGroup {\n  summary\n  artists\n  artworks {\n    artists(shallow: true) {\n      href\n      __id\n    }\n    ...GenericGrid_artworks\n    __id\n  }\n  image {\n    resized(height: 80, width: 80) {\n      url\n    }\n  }\n  __id\n}\n\nfragment GenericGrid_artworks on Artwork {\n  __id\n  id\n  image {\n    aspect_ratio\n  }\n  ...Artwork_artwork\n}\n\nfragment Artwork_artwork on Artwork {\n  title\n  date\n  sale_message\n  is_in_auction\n  id\n  sale_artwork {\n    opening_bid {\n      display\n    }\n    current_bid {\n      display\n    }\n    bidder_positions_count\n    sale {\n      is_open\n      __id\n    }\n    __id\n  }\n  image {\n    url(version: \"large\")\n    aspect_ratio\n  }\n  artists(shallow: true) {\n    name\n    __id\n  }\n  partner {\n    name\n    __id\n  }\n  href\n  __id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersWorksForYouQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "viewer",
        "name": "__viewer_viewer",
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
                "name": "selectedArtist",
                "variableName": "selectedArtist",
                "type": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersWorksForYouQuery",
    "argumentDefinitions": v0,
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
                    "storageKey": "bundledArtworksByArtist(first:10,sort:\"PUBLISHED_AT_DESC\")",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 10,
                        "type": "Int"
                      },
                      {
                        "kind": "Literal",
                        "name": "sort",
                        "value": "PUBLISHED_AT_DESC",
                        "type": "ArtworkSorts"
                      }
                    ],
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
                              v1,
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
                                  v2,
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "artists",
                                    "storageKey": "artists(shallow:true)",
                                    "args": v3,
                                    "concreteType": "Artist",
                                    "plural": true,
                                    "selections": [
                                      v4,
                                      v1,
                                      v5
                                    ],
                                    "idField": "__id"
                                  },
                                  v6,
                                  v7,
                                  v8,
                                  v1,
                                  v9,
                                  v10,
                                  v12,
                                  v14,
                                  v4
                                ],
                                "idField": "__id"
                              },
                              v15,
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "__typename",
                                "args": null,
                                "storageKey": null
                              }
                            ],
                            "idField": "__id"
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
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 10,
                        "type": "Int"
                      },
                      {
                        "kind": "Literal",
                        "name": "sort",
                        "value": "PUBLISHED_AT_DESC",
                        "type": "ArtworkSorts"
                      }
                    ],
                    "handle": "connection",
                    "key": "WorksForYou_notifications",
                    "filters": [
                      "sort"
                    ]
                  }
                ]
              },
              v1
            ],
            "idField": "__id"
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
                "variableName": "selectedArtist",
                "type": "String!"
              }
            ],
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              v4,
              v5,
              v15,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "artworks",
                "storageKey": "artworks(size:6,sort:\"published_at_desc\")",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "size",
                    "value": 6,
                    "type": "Int"
                  },
                  {
                    "kind": "Literal",
                    "name": "sort",
                    "value": "published_at_desc",
                    "type": "ArtworkSorts"
                  }
                ],
                "concreteType": "Artwork",
                "plural": true,
                "selections": [
                  v9,
                  v1,
                  v7,
                  v8,
                  v2,
                  v6,
                  v10,
                  v12,
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "artists",
                    "storageKey": "artists(shallow:true)",
                    "args": v3,
                    "concreteType": "Artist",
                    "plural": true,
                    "selections": v13,
                    "idField": "__id"
                  },
                  v14,
                  v4
                ],
                "idField": "__id"
              },
              v1
            ],
            "idField": "__id"
          }
        ]
      },
      {
        "kind": "LinkedHandle",
        "alias": null,
        "name": "viewer",
        "args": null,
        "handle": "viewer",
        "key": "",
        "filters": null
      }
    ]
  }
};
})();
(node as any).hash = '3214ba446deec53110f75845dcede778';
export default node;
