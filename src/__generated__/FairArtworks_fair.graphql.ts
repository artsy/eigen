/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FilteredInfiniteScrollGrid_filteredArtworks$ref } from "./FilteredInfiniteScrollGrid_filteredArtworks.graphql";
declare const _FairArtworks_fair$ref: unique symbol;
export type FairArtworks_fair$ref = typeof _FairArtworks_fair$ref;
export type FairArtworks_fair = {
    readonly id: string;
    readonly internalID: string;
    readonly slug: string;
    readonly artworks: {
        readonly " $fragmentRefs": FilteredInfiniteScrollGrid_filteredArtworks$ref;
    } | null;
    readonly " $refType": FairArtworks_fair$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FairArtworks_fair",
  "type": "Fair",
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
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "artworks",
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
          ]
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
(node as any).hash = '9a5931a210af8011d1be6968b13cfaea';
export default node;
