/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 58d26b86534df80b90bc29ebdc85b2fc */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SavedSearchAlertsListQueryVariables = {};
export type SavedSearchAlertsListQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"SavedSearchAlertsList_me">;
    } | null;
};
export type SavedSearchAlertsListQuery = {
    readonly response: SavedSearchAlertsListQueryResponse;
    readonly variables: SavedSearchAlertsListQueryVariables;
};



/*
query SavedSearchAlertsListQuery {
  me {
    ...SavedSearchAlertsList_me
    id
  }
}

fragment SavedSearchAlertsList_me on Me {
  ...SavedSearches_me
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
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SavedSearchAlertsListQuery",
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
            "name": "SavedSearchAlertsList_me"
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
    "name": "SavedSearchAlertsListQuery",
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
    "id": "58d26b86534df80b90bc29ebdc85b2fc",
    "metadata": {},
    "name": "SavedSearchAlertsListQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '474d86bfa517beda67466ea10eaa335a';
export default node;
