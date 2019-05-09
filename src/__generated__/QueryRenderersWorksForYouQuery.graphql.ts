/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { WorksForYou_viewer$ref } from "./WorksForYou_viewer.graphql";
export type QueryRenderersWorksForYouQueryVariables = {
    readonly selectedArtist: string;
};
export type QueryRenderersWorksForYouQueryResponse = {
    readonly viewer: ({
        readonly " $fragmentRefs": WorksForYou_viewer$ref;
    }) | null;
};
export type QueryRenderersWorksForYouQuery = {
    readonly response: QueryRenderersWorksForYouQueryResponse;
    readonly variables: QueryRenderersWorksForYouQueryVariables;
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
    id
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
  "name": "href",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
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
    }
  ]
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v6 = {
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
  "id": "a26eb3f2161a0b0ecc96e656bbee4a32",
  "text": null,
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
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "artists",
                                    "storageKey": "artists(shallow:true)",
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "shallow",
                                        "value": true,
                                        "type": "Boolean"
                                      }
                                    ],
                                    "concreteType": "Artist",
                                    "plural": true,
                                    "selections": [
                                      v2,
                                      v1
                                    ]
                                  },
                                  v1,
                                  v3,
                                  v4,
                                  v5
                                ]
                              },
                              v6,
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
                "variableName": "selectedArtist",
                "type": "String!"
              }
            ],
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              v3,
              v2,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              },
              v6,
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
                  v1,
                  v3,
                  v4,
                  v5
                ]
              },
              v1
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
(node as any).hash = '3214ba446deec53110f75845dcede778';
export default node;
