/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type ArtworkAggregation = "COLOR" | "DIMENSION_RANGE" | "FOLLOWED_ARTISTS" | "GALLERY" | "INSTITUTION" | "MAJOR_PERIOD" | "MEDIUM" | "MERCHANDISABLE_ARTISTS" | "PARTNER_CITY" | "PERIOD" | "PRICE_RANGE" | "TOTAL" | "%future added value";
export type Filters_filteredArtworks = {
    readonly aggregations: ReadonlyArray<{
        readonly slice: ArtworkAggregation | null;
        readonly counts: ReadonlyArray<{
            readonly name: string;
            readonly value: string;
        } | null> | null;
    } | null> | null;
    readonly " $refType": "Filters_filteredArtworks";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Filters_filteredArtworks",
  "type": "FilterArtworksConnection",
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
              "name": "name",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "value",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '91d31761bb4205fec2bf49fa49d6b080';
export default node;
