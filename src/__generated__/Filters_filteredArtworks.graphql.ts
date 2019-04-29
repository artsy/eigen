/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type ArtworkAggregation = "COLOR" | "DIMENSION_RANGE" | "FOLLOWED_ARTISTS" | "GALLERY" | "INSTITUTION" | "MAJOR_PERIOD" | "MEDIUM" | "MERCHANDISABLE_ARTISTS" | "PARTNER_CITY" | "PERIOD" | "PRICE_RANGE" | "TOTAL" | "%future added value";
declare const _Filters_filteredArtworks$ref: unique symbol;
export type Filters_filteredArtworks$ref = typeof _Filters_filteredArtworks$ref;
export type Filters_filteredArtworks = {
    readonly aggregations: ReadonlyArray<({
        readonly slice: ArtworkAggregation | null;
        readonly counts: ReadonlyArray<({
            readonly gravityID: string;
            readonly name: string | null;
        }) | null> | null;
    }) | null> | null;
    readonly " $refType": Filters_filteredArtworks$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Filters_filteredArtworks",
  "type": "FilterArtworks",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
            v0
          ]
        }
      ]
    },
    v0
  ]
};
})();
(node as any).hash = 'a1f2ee6a37c09ada16819b191cea318f';
export default node;
