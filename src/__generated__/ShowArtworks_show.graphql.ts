/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FilteredInfiniteScrollGrid_filteredArtworks$ref } from "./FilteredInfiniteScrollGrid_filteredArtworks.graphql";
declare const _ShowArtworks_show$ref: unique symbol;
export type ShowArtworks_show$ref = typeof _ShowArtworks_show$ref;
export type ShowArtworks_show = {
    readonly id: string;
    readonly gravityID: string;
    readonly _id: string;
    readonly filteredArtworks: ({
        readonly " $fragmentRefs": FilteredInfiniteScrollGrid_filteredArtworks$ref;
    }) | null;
    readonly " $refType": ShowArtworks_show$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ShowArtworks_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [
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
      "name": "gravityID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "_id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "filteredArtworks",
      "storageKey": null,
      "args": [
        {
          "kind": "Literal",
          "name": "aggregations",
          "value": [
            "MEDIUM",
            "PRICE_RANGE",
            "TOTAL"
          ],
          "type": "[ArtworkAggregation]"
        },
        {
          "kind": "Variable",
          "name": "medium",
          "variableName": "medium",
          "type": "String"
        },
        {
          "kind": "Variable",
          "name": "price_range",
          "variableName": "price_range",
          "type": "String"
        },
        {
          "kind": "Literal",
          "name": "size",
          "value": 0,
          "type": "Int"
        }
      ],
      "concreteType": "FilterArtworks",
      "plural": false,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "FilteredInfiniteScrollGrid_filteredArtworks",
          "args": null
        }
      ]
    }
  ]
};
(node as any).hash = '751e4fe2bf1dca4a401f1ec18c468383';
export default node;
