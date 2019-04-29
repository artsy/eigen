/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Artists_me$ref } from "./Artists_me.graphql";
export type FavoriteArtistsQueryVariables = {};
export type FavoriteArtistsQueryResponse = {
    readonly me: ({
        readonly " $fragmentRefs": Artists_me$ref;
    }) | null;
};
export type FavoriteArtistsQuery = {
    readonly response: FavoriteArtistsQueryResponse;
    readonly variables: FavoriteArtistsQueryVariables;
};



/*
query FavoriteArtistsQuery {
  me {
    ...Artists_me
    __id: id
  }
}

fragment Artists_me on Me {
  followed_artists_connection(first: 10) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        artist {
          gravityID
          id
          name
          href
          image {
            url
          }
          __id: id
        }
        __id: id
        __typename
      }
      cursor
    }
  }
  __id: id
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FavoriteArtistsQuery",
  "id": null,
  "text": "query FavoriteArtistsQuery {\n  me {\n    ...Artists_me\n    __id: id\n  }\n}\n\nfragment Artists_me on Me {\n  followed_artists_connection(first: 10) {\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n    edges {\n      node {\n        artist {\n          gravityID\n          id\n          name\n          href\n          image {\n            url\n          }\n          __id: id\n        }\n        __id: id\n        __typename\n      }\n      cursor\n    }\n  }\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FavoriteArtistsQuery",
    "type": "Query",
    "metadata": null,
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
            "kind": "FragmentSpread",
            "name": "Artists_me",
            "args": null
          },
          v0
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FavoriteArtistsQuery",
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
            "name": "followed_artists_connection",
            "storageKey": "followed_artists_connection(first:10)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10,
                "type": "Int"
              }
            ],
            "concreteType": "FollowArtistConnection",
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
                    "name": "endCursor",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "hasNextPage",
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
                "concreteType": "FollowArtistEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "FollowArtist",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artist",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artist",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "gravityID",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "id",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "name",
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
                          v0
                        ]
                      },
                      v0,
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
            "alias": null,
            "name": "followed_artists_connection",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10,
                "type": "Int"
              }
            ],
            "handle": "connection",
            "key": "Artists_followed_artists_connection",
            "filters": null
          },
          v0
        ]
      }
    ]
  }
};
})();
(node as any).hash = '1a3b1c0e2584328d41f07185fb29f309';
export default node;
