/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 3208bca7638df7a7cc7810d6e7752e34 */

import { ConcreteRequest } from "relay-runtime";
export type ArtistArticlesResultQueryVariables = {
    artistID: string;
};
export type ArtistArticlesResultQueryResponse = {
    readonly artist: {
        readonly id: string;
        readonly articlesConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                } | null;
            } | null> | null;
        } | null;
    } | null;
};
export type ArtistArticlesResultQuery = {
    readonly response: ArtistArticlesResultQueryResponse;
    readonly variables: ArtistArticlesResultQueryVariables;
};



/*
query ArtistArticlesResultQuery(
  $artistID: String!
) {
  artist(id: $artistID) {
    id
    articlesConnection(first: 10) {
      edges {
        node {
          id
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artistID"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "artistID"
      }
    ],
    "concreteType": "Artist",
    "kind": "LinkedField",
    "name": "artist",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": [
          {
            "kind": "Literal",
            "name": "first",
            "value": 10
          }
        ],
        "concreteType": "ArticleConnection",
        "kind": "LinkedField",
        "name": "articlesConnection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ArticleEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Article",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "articlesConnection(first:10)"
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistArticlesResultQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtistArticlesResultQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "id": "3208bca7638df7a7cc7810d6e7752e34",
    "metadata": {},
    "name": "ArtistArticlesResultQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'e46d2777dd908d009817e98daa2e37b2';
export default node;
