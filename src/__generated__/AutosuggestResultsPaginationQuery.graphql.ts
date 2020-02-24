/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AutosuggestResultsPaginationQueryVariables = {
    query: string;
    count: number;
    cursor?: string | null;
};
export type AutosuggestResultsPaginationQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"AutosuggestResults_results">;
};
export type AutosuggestResultsPaginationQueryRawResponse = {
    readonly results: ({
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly imageUrl: string | null;
                readonly href: string | null;
                readonly displayLabel: string | null;
                readonly id: string | null;
                readonly __typename: "SearchableItem";
                readonly displayType: string | null;
                readonly slug: string;
            } | {
                readonly imageUrl: string | null;
                readonly href: string | null;
                readonly displayLabel: string | null;
                readonly id: string | null;
                readonly __typename: string;
            }) | null;
            readonly cursor: string;
        }) | null> | null;
        readonly pageInfo: {
            readonly endCursor: string | null;
            readonly hasNextPage: boolean;
        };
    }) | null;
};
export type AutosuggestResultsPaginationQuery = {
    readonly response: AutosuggestResultsPaginationQueryResponse;
    readonly variables: AutosuggestResultsPaginationQueryVariables;
    readonly rawResponse: AutosuggestResultsPaginationQueryRawResponse;
};



/*
query AutosuggestResultsPaginationQuery(
  $query: String!
  $count: Int!
  $cursor: String
) {
  ...AutosuggestResults_results_1jWD3d
}

fragment AutosuggestResults_results_1jWD3d on Query {
  results: searchConnection(query: $query, mode: AUTOSUGGEST, first: $count, after: $cursor, entities: [ARTIST, ARTWORK, FAIR, GENE, SALE, PROFILE, COLLECTION]) {
    edges {
      node {
        imageUrl
        href
        displayLabel
        ... on SearchableItem {
          displayType
          slug
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
  "kind": "Variable",
  "name": "query",
  "variableName": "query"
},
v2 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Literal",
    "name": "entities",
    "value": [
      "ARTIST",
      "ARTWORK",
      "FAIR",
      "GENE",
      "SALE",
      "PROFILE",
      "COLLECTION"
    ]
  },
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
    "name": "AutosuggestResultsPaginationQuery",
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
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "AutosuggestResultsPaginationQuery",
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
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "slug",
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
          "mode",
          "entities"
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "AutosuggestResultsPaginationQuery",
    "id": "9e7fa812ce7710330d7b73678fd8aa1e",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '9ad2750be9283e0077f7bc5dc7f27ed7';
export default node;
