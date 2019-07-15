/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Artists_me$ref } from "./Artists_me.graphql";
export type ArtistsMeQueryVariables = {
    readonly count: number;
    readonly cursor?: string | null;
};
export type ArtistsMeQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": Artists_me$ref;
    } | null;
};
export type ArtistsMeQuery = {
    readonly response: ArtistsMeQueryResponse;
    readonly variables: ArtistsMeQueryVariables;
};



/*
query ArtistsMeQuery(
  $count: Int!
  $cursor: String
) {
  me {
    ...Artists_me_1G22uz
    id
  }
}

fragment Artists_me_1G22uz on Me {
  followed_artists_connection(first: $count, after: $cursor) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        artist {
          slug
          id
          name
          href
          image {
            url
          }
        }
        id
        __typename
      }
      cursor
    }
  }
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
v1 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistsMeQuery",
    "type": "Query",
    "metadata": null,
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
            "kind": "FragmentSpread",
            "name": "Artists_me",
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
    "name": "ArtistsMeQuery",
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
            "name": "followed_artists_connection",
            "storageKey": null,
            "args": (v1/*: any*/),
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
                            "name": "slug",
                            "args": null,
                            "storageKey": null
                          },
                          (v2/*: any*/),
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
                          }
                        ]
                      },
                      (v2/*: any*/),
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
            "args": (v1/*: any*/),
            "handle": "connection",
            "key": "Artists_followed_artists_connection",
            "filters": null
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtistsMeQuery",
    "id": "9a4f600116fd4cdaaa912cc6d63d04ac",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'a06e6f32f9eb0bbdc9517ef7065762d2';
export default node;
