/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 7f05c96bd766229abc081b08cdb18307 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SavedSearchesListTestsQueryVariables = {};
export type SavedSearchesListTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"SavedSearchesList_me">;
    } | null;
};
export type SavedSearchesListTestsQuery = {
    readonly response: SavedSearchesListTestsQueryResponse;
    readonly variables: SavedSearchesListTestsQueryVariables;
};



/*
query SavedSearchesListTestsQuery {
  me {
    ...SavedSearchesList_me
    id
  }
}

fragment SavedSearchesList_me on Me {
  savedSearchesConnection(first: 20) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        internalID
        userAlertSettings {
          name
        }
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
    "kind": "Literal",
    "name": "first",
    "value": 20
  }
],
v1 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v2 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v3 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SavedSearchesListTestsQuery",
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
            "name": "SavedSearchesList_me"
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
    "name": "SavedSearchesListTestsQuery",
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
            "concreteType": "SearchCriteriaConnection",
            "kind": "LinkedField",
            "name": "savedSearchesConnection",
            "plural": false,
            "selections": [
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
                    "name": "hasNextPage",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "startCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endCursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "SearchCriteriaEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "SearchCriteria",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "internalID",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SavedSearchUserAlertSettings",
                        "kind": "LinkedField",
                        "name": "userAlertSettings",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "name",
                            "storageKey": null
                          }
                        ],
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
              }
            ],
            "storageKey": "savedSearchesConnection(first:20)"
          },
          {
            "alias": null,
            "args": (v0/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "SavedSearches_savedSearchesConnection",
            "kind": "LinkedHandle",
            "name": "savedSearchesConnection"
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "7f05c96bd766229abc081b08cdb18307",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.id": (v1/*: any*/),
        "me.savedSearchesConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SearchCriteriaConnection"
        },
        "me.savedSearchesConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "SearchCriteriaEdge"
        },
        "me.savedSearchesConnection.edges.cursor": (v2/*: any*/),
        "me.savedSearchesConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SearchCriteria"
        },
        "me.savedSearchesConnection.edges.node.__typename": (v2/*: any*/),
        "me.savedSearchesConnection.edges.node.internalID": (v1/*: any*/),
        "me.savedSearchesConnection.edges.node.userAlertSettings": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "SavedSearchUserAlertSettings"
        },
        "me.savedSearchesConnection.edges.node.userAlertSettings.name": (v3/*: any*/),
        "me.savedSearchesConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "me.savedSearchesConnection.pageInfo.endCursor": (v3/*: any*/),
        "me.savedSearchesConnection.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "me.savedSearchesConnection.pageInfo.startCursor": (v3/*: any*/)
      }
    },
    "name": "SavedSearchesListTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'd051faa41814d4960f1c8ade69a5748d';
export default node;
