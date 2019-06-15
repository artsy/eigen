/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { About_gene$ref } from "./About_gene.graphql";
import { GeneArtworksGrid_filtered_artworks$ref } from "./GeneArtworksGrid_filtered_artworks.graphql";
import { Header_gene$ref } from "./Header_gene.graphql";
export type ArtworkAggregation = "COLOR" | "DIMENSION_RANGE" | "FOLLOWED_ARTISTS" | "GALLERY" | "INSTITUTION" | "MAJOR_PERIOD" | "MEDIUM" | "MERCHANDISABLE_ARTISTS" | "PARTNER_CITY" | "PERIOD" | "PRICE_RANGE" | "TOTAL" | "%future added value";
declare const _Gene_gene$ref: unique symbol;
export type Gene_gene$ref = typeof _Gene_gene$ref;
export type Gene_gene = {
    readonly id: string;
    readonly internalID: string;
    readonly filtered_artworks: {
        readonly counts: {
            readonly total: any | null;
        } | null;
        readonly aggregations: ReadonlyArray<{
            readonly slice: ArtworkAggregation | null;
            readonly counts: ReadonlyArray<{
                readonly gravityID: string;
                readonly name: string | null;
                readonly count: number | null;
            } | null> | null;
        } | null> | null;
        readonly " $fragmentRefs": GeneArtworksGrid_filtered_artworks$ref;
    } | null;
    readonly " $fragmentRefs": Header_gene$ref & About_gene$ref;
    readonly " $refType": Gene_gene$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Variable",
  "name": "sort",
  "variableName": "sort"
};
return {
  "kind": "Fragment",
  "name": "Gene_gene",
  "type": "Gene",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "sort",
      "type": "String",
      "defaultValue": "-partner_updated_at"
    },
    {
      "kind": "LocalArgument",
      "name": "medium",
      "type": "String",
      "defaultValue": "*"
    },
    {
      "kind": "LocalArgument",
      "name": "price_range",
      "type": "String",
      "defaultValue": "*-*"
    }
  ],
  "selections": [
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
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "filtered_artworks",
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
          "kind": "Literal",
          "name": "for_sale",
          "value": true
        },
        {
          "kind": "Variable",
          "name": "medium",
          "variableName": "medium"
        },
        {
          "kind": "Variable",
          "name": "price_range",
          "variableName": "price_range"
        },
        {
          "kind": "Literal",
          "name": "size",
          "value": 0
        },
        (v0/*: any*/)
      ],
      "concreteType": "FilterArtworks",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "counts",
          "storageKey": null,
          "args": null,
          "concreteType": "FilterArtworksCounts",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "total",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "aggregations",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtworksAggregationResults",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "slice",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "counts",
              "storageKey": null,
              "args": null,
              "concreteType": "AggregationCount",
              "plural": true,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "gravityID",
                  "args": null,
                  "storageKey": null
                },
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
                  "name": "count",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        },
        {
          "kind": "FragmentSpread",
          "name": "GeneArtworksGrid_filtered_artworks",
          "args": [
            (v0/*: any*/)
          ]
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "Header_gene",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "About_gene",
      "args": null
    }
  ]
};
})();
(node as any).hash = '4e862e30fdb753e31fc73a9effb8d703';
export default node;
