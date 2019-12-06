/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AutosuggestResultsQueryVariables = {
    query: string;
    count?: number | null;
};
export type AutosuggestResultsQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"AutosuggestResults_results">;
};
export type AutosuggestResultsQuery = {
    readonly response: AutosuggestResultsQueryResponse;
    readonly variables: AutosuggestResultsQueryVariables;
};



/*
query AutosuggestResultsQuery(
  $query: String!
  $count: Int
) {
  ...AutosuggestResults_results_1bcUq5
}

fragment AutosuggestResults_results_1bcUq5 on Query {
  results: searchConnection(query: $query, mode: AUTOSUGGEST, first: $count) {
    edges {
      node {
        imageUrl
        href
        displayLabel
        ... on SearchableItem {
          displayType
        }
        ... on Node {
          id
        }
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
    "kind": "LocalArgument",
    "name": "query",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int",
    "defaultValue": null
  }
],
v1 = {
  "kind": "Variable",
  "name": "query",
  "variableName": "query"
},
v2 = [
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  {
    "kind": "Literal",
    "name": "mode",
    "value": "AUTOSUGGEST"
  },
  (v1/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "AutosuggestResultsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "FragmentSpread",
        "name": "AutosuggestResults_results",
        "args": [
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "AutosuggestResultsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "results",
        "name": "searchConnection",
        "storageKey": null,
        "args": (v2/*: any*/),
        "concreteType": "SearchableConnection",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "edges",
            "storageKey": null,
            "args": null,
            "concreteType": "SearchableEdge",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": null,
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "imageUrl",
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
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "displayLabel",
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
                    "name": "__typename",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "SearchableItem",
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "displayType",
                        "args": null,
                        "storageKey": null
                      }
                    ]
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
          },
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
          }
        ]
      },
      {
        "kind": "LinkedHandle",
        "alias": "results",
        "name": "searchConnection",
        "args": (v2/*: any*/),
        "handle": "connection",
        "key": "AutosuggestResults_results",
        "filters": [
          "query",
          "mode"
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "AutosuggestResultsQuery",
    "id": "965a233ccdfcec5697b87c7fde155ef9",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '2b1fed6f69fc2d626551f537fa4af69f';
export default node;
