/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { Filters_filteredArtworks$ref } from "./Filters_filteredArtworks.graphql";
import { InfiniteScrollArtworksGrid_connection$ref } from "./InfiniteScrollArtworksGrid_connection.graphql";
declare const _FilteredInfiniteScrollGrid_entity$ref: unique symbol;
export type FilteredInfiniteScrollGrid_entity$ref = typeof _FilteredInfiniteScrollGrid_entity$ref;
export type FilteredInfiniteScrollGrid_entity = {
    readonly id: string;
    readonly filterArtworksConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly slug: string;
            } | null;
        } | null> | null;
        readonly " $fragmentRefs": Filters_filteredArtworks$ref & InfiniteScrollArtworksGrid_connection$ref;
    } | null;
    readonly " $refType": FilteredInfiniteScrollGrid_entity$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "FilteredInfiniteScrollGrid_entity",
  "type": "EntityWithFilterArtworksConnectionInterface",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "filterArtworksConnection"
        ]
      }
    ]
  },
  "argumentDefinitions": [
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
      "defaultValue": null
    },
    {
      "kind": "LocalArgument",
      "name": "medium",
      "type": "String",
      "defaultValue": "*"
    },
    {
      "kind": "LocalArgument",
      "name": "priceRange",
      "type": "String",
      "defaultValue": "*-*"
    }
  ],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "LinkedField",
      "alias": "filterArtworksConnection",
      "name": "__FilteredInfiniteScrollGridContainer_filterArtworksConnection_connection",
      "storageKey": null,
      "args": [
        {
          "kind": "Literal",
          "name": "aggregations",
          "value": [
            "MEDIUM",
            "PRICE_RANGE",
            "TOTAL"
          ]
        },
        {
          "kind": "Variable",
          "name": "medium",
          "variableName": "medium"
        },
        {
          "kind": "Variable",
          "name": "priceRange",
          "variableName": "priceRange"
        }
      ],
      "concreteType": "FilterArtworksConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "FilterArtworksEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Artwork",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "slug",
                  "args": null,
                  "storageKey": null
                },
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
        },
        {
          "kind": "FragmentSpread",
          "name": "Filters_filteredArtworks",
          "args": null
        },
        {
          "kind": "FragmentSpread",
          "name": "InfiniteScrollArtworksGrid_connection",
          "args": null
        }
      ]
    }
  ]
};
})();
(node as any).hash = '6fb12e1c4c55eacc3a06f0dd31acf3b9';
export default node;
