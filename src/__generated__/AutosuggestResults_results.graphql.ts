/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type AutosuggestResults_results = {
    readonly results: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly imageUrl: string | null;
                readonly href: string | null;
                readonly displayLabel: string | null;
                readonly displayType?: string | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "AutosuggestResults_results";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "AutosuggestResults_results",
  "type": "Query",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "results"
        ]
      }
    ]
  },
  "argumentDefinitions": [
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
      "defaultValue": 10
    },
    {
      "kind": "LocalArgument",
      "name": "cursor",
      "type": "String",
      "defaultValue": ""
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "results",
      "name": "__AutosuggestResults_results_connection",
      "storageKey": null,
      "args": [
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
    }
  ]
};
(node as any).hash = '471ecbc5c8aa3ba00ed3775baef88ce2';
export default node;
