/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type AutosuggestResultsQueryVariables = {
    query: string;
};
export type AutosuggestResultsQueryResponse = {
    readonly searchConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly imageUrl: string | null;
                readonly href: string | null;
                readonly displayLabel: string | null;
                readonly displayType?: string | null;
            } | null;
        } | null> | null;
    } | null;
};
export type AutosuggestResultsQuery = {
    readonly response: AutosuggestResultsQueryResponse;
    readonly variables: AutosuggestResultsQueryVariables;
};



/*
query AutosuggestResultsQuery(
  $query: String!
) {
  searchConnection(query: $query, mode: AUTOSUGGEST, first: 5) {
    edges {
      node {
        __typename
        imageUrl
        href
        displayLabel
        ... on SearchableItem {
          displayType
        }
        ... on Node {
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
    "kind": "LocalArgument",
    "name": "query",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 5
  },
  {
    "kind": "Literal",
    "name": "mode",
    "value": "AUTOSUGGEST"
  },
  {
    "kind": "Variable",
    "name": "query",
    "variableName": "query"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "imageUrl",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "displayLabel",
  "args": null,
  "storageKey": null
},
v5 = {
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
};
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
        "kind": "LinkedField",
        "alias": null,
        "name": "searchConnection",
        "storageKey": null,
        "args": (v1/*: any*/),
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/)
                ]
              }
            ]
          }
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
        "alias": null,
        "name": "searchConnection",
        "storageKey": null,
        "args": (v1/*: any*/),
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
                    "name": "__typename",
                    "args": null,
                    "storageKey": null
                  },
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "id",
                    "args": null,
                    "storageKey": null
                  },
                  (v5/*: any*/)
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "AutosuggestResultsQuery",
    "id": "12f6b52ac05a984fee9358bfb139c213",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'df1324149fa22b112d3bcf141f3249a9';
export default node;
