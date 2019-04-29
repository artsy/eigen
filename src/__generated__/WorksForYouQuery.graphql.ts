/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { WorksForYou_viewer$ref } from "./WorksForYou_viewer.graphql";
export type WorksForYouQueryVariables = {
    readonly count: number;
    readonly cursor?: string | null;
};
export type WorksForYouQueryResponse = {
    readonly viewer: ({
        readonly " $fragmentRefs": WorksForYou_viewer$ref;
    }) | null;
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
            __id: id
            __typename
          }
          cursor
        }
      }
    }
    __id: id
  }
  selectedArtist: artist(id: "") {
    gravityID
    href
    name
    image {
      resized(height: 80, width: 80) {
        url
      }
    }
    artworks(sort: published_at_desc, size: 6) {
      ...GenericGrid_artworks
      __id: id
    }
    __id: id
  }
}

fragment Notification_notification on FollowedArtistsArtworksGroup {
  summary
  artists
  artworks {
    artists(shallow: true) {
      href
      __id: id
    }
    ...GenericGrid_artworks
    __id: id
  }
  image {
    resized(height: 80, width: 80) {
      url
    }
  }
  __id: id
}

fragment GenericGrid_artworks on Artwork {
  id
  gravityID
  image {
    aspect_ratio
  }
  ...Artwork_artwork
  __id: id
}

fragment Artwork_artwork on Artwork {
  title
  date
  sale_message
  is_in_auction
  is_biddable
  is_acquireable
  is_offerable
  gravityID
  sale {
    is_auction
    is_live_open
    is_open
    is_closed
    display_timely_at
    __id: id
  }
  sale_artwork {
    opening_bid {
      display
    }
    current_bid {
      display
    }
    bidder_positions_count
    sale {
      is_closed
      __id: id
    }
    __id: id
  }
  image {
    url(version: "large")
    aspect_ratio
  }
  artists(shallow: true) {
    name
    __id: id
  }
  partner {
    name
    __id: id
  }
  href
  __id: id
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
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_biddable",
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
  "alias": "__id",
  "name": "id",
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
  "name": "gravityID",
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
          "value": "large",
          "type": "[String]"
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
  "name": "is_acquireable",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_offerable",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
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
    v15,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "display_timely_at",
      "args": null,
      "storageKey": null
    },
    v5
  ]
},
v17 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
],
v18 = {
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
      "selections": v17
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "current_bid",
      "storageKey": null,
      "args": null,
      "concreteType": "SaleArtworkCurrentBid",
      "plural": false,
      "selections": v17
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
        v15,
        v5
      ]
    },
    v5
  ]
},
v19 = [
  v6,
  v5
],
v20 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": v19
},
v21 = {
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
  "name": "WorksForYouQuery",
  "id": null,
  "text": "query WorksForYouQuery(\n  $count: Int!\n  $cursor: String\n) {\n  viewer {\n    ...WorksForYou_viewer_1G22uz\n  }\n}\n\nfragment WorksForYou_viewer_1G22uz on Viewer {\n  me {\n    followsAndSaves {\n      notifications: bundledArtworksByArtist(sort: PUBLISHED_AT_DESC, first: $count, after: $cursor) {\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        edges {\n          node {\n            id\n            ...Notification_notification\n            __id: id\n            __typename\n          }\n          cursor\n        }\n      }\n    }\n    __id: id\n  }\n  selectedArtist: artist(id: \"\") {\n    gravityID\n    href\n    name\n    image {\n      resized(height: 80, width: 80) {\n        url\n      }\n    }\n    artworks(sort: published_at_desc, size: 6) {\n      ...GenericGrid_artworks\n      __id: id\n    }\n    __id: id\n  }\n}\n\nfragment Notification_notification on FollowedArtistsArtworksGroup {\n  summary\n  artists\n  artworks {\n    artists(shallow: true) {\n      href\n      __id: id\n    }\n    ...GenericGrid_artworks\n    __id: id\n  }\n  image {\n    resized(height: 80, width: 80) {\n      url\n    }\n  }\n  __id: id\n}\n\nfragment GenericGrid_artworks on Artwork {\n  id\n  gravityID\n  image {\n    aspect_ratio\n  }\n  ...Artwork_artwork\n  __id: id\n}\n\nfragment Artwork_artwork on Artwork {\n  title\n  date\n  sale_message\n  is_in_auction\n  is_biddable\n  is_acquireable\n  is_offerable\n  gravityID\n  sale {\n    is_auction\n    is_live_open\n    is_open\n    is_closed\n    display_timely_at\n    __id: id\n  }\n  sale_artwork {\n    opening_bid {\n      display\n    }\n    current_bid {\n      display\n    }\n    bidder_positions_count\n    sale {\n      is_closed\n      __id: id\n    }\n    __id: id\n  }\n  image {\n    url(version: \"large\")\n    aspect_ratio\n  }\n  artists(shallow: true) {\n    name\n    __id: id\n  }\n  partner {\n    name\n    __id: id\n  }\n  href\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "WorksForYouQuery",
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
                "name": "count",
                "variableName": "count",
                "type": null
              },
              {
                "kind": "Variable",
                "name": "cursor",
                "variableName": "cursor",
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
    "name": "WorksForYouQuery",
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
                    "storageKey": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "after",
                        "variableName": "cursor",
                        "type": "String"
                      },
                      {
                        "kind": "Variable",
                        "name": "first",
                        "variableName": "count",
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
                                      v5,
                                      v6
                                    ]
                                  },
                                  v7,
                                  v8,
                                  v9,
                                  v10,
                                  v11,
                                  v12,
                                  v1,
                                  v13,
                                  v14,
                                  v16,
                                  v18,
                                  v20,
                                  v4,
                                  v5
                                ]
                              },
                              v21,
                              v5,
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
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "after",
                        "variableName": "cursor",
                        "type": "String"
                      },
                      {
                        "kind": "Variable",
                        "name": "first",
                        "variableName": "count",
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
              v5
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
                "value": "",
                "type": "String!"
              }
            ],
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              v7,
              v4,
              v6,
              v21,
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
                  v13,
                  v1,
                  v8,
                  v9,
                  v10,
                  v11,
                  v12,
                  v2,
                  v7,
                  v14,
                  v16,
                  v18,
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "artists",
                    "storageKey": "artists(shallow:true)",
                    "args": v3,
                    "concreteType": "Artist",
                    "plural": true,
                    "selections": v19
                  },
                  v20,
                  v4,
                  v5
                ]
              },
              v5
            ]
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
(node as any).hash = 'cdaed0d06ebf1989bb6ad7ef67258acd';
export default node;
