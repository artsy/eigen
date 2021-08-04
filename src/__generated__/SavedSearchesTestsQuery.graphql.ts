/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 29da0c9037dc61a81d898672ea71cff7 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SavedSearchesTestsQueryVariables = {};
export type SavedSearchesTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"SavedSearches_me">;
    } | null;
};
export type SavedSearchesTestsQuery = {
    readonly response: SavedSearchesTestsQueryResponse;
    readonly variables: SavedSearchesTestsQueryVariables;
};



/*
query SavedSearchesTestsQuery {
  me {
    ...SavedSearches_me
    id
  }
}

fragment SavedSearches_me on Me {
  recentlyViewedArtworksConnection(first: 20) {
    edges {
      node {
        id
        slug
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v3 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SavedSearchesTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SavedSearches_me"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SavedSearchesTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v0/*: any*/),
            "concreteType": "ArtworkConnection",
            "kind": "LinkedField",
            "name": "recentlyViewedArtworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ArtworkEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "slug",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__typename",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "PageInfo",
                "kind": "LinkedField",
                "name": "pageInfo",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasNextPage",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "recentlyViewedArtworksConnection(first:20)"
          },
          {
            "alias": null,
            "args": (v0/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "SavedSearches_recentlyViewedArtworksConnection",
            "kind": "LinkedHandle",
            "name": "recentlyViewedArtworksConnection"
          },
          (v1/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "29da0c9037dc61a81d898672ea71cff7",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.id": (v2/*: any*/),
        "me.recentlyViewedArtworksConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtworkConnection"
        },
        "me.recentlyViewedArtworksConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdge"
        },
        "me.recentlyViewedArtworksConnection.edges.cursor": (v3/*: any*/),
        "me.recentlyViewedArtworksConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "me.recentlyViewedArtworksConnection.edges.node.__typename": (v3/*: any*/),
        "me.recentlyViewedArtworksConnection.edges.node.id": (v2/*: any*/),
        "me.recentlyViewedArtworksConnection.edges.node.slug": (v2/*: any*/),
        "me.recentlyViewedArtworksConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "me.recentlyViewedArtworksConnection.pageInfo.endCursor": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
        },
        "me.recentlyViewedArtworksConnection.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        }
      }
    },
    "name": "SavedSearchesTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '40d3937d3c8790b30b8cc60e0b41bbcf';
export default node;
