/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkAggregation = "ARTIST" | "ARTIST_NATIONALITY" | "ATTRIBUTION_CLASS" | "COLOR" | "DIMENSION_RANGE" | "FOLLOWED_ARTISTS" | "GALLERY" | "INSTITUTION" | "MAJOR_PERIOD" | "MEDIUM" | "MERCHANDISABLE_ARTISTS" | "PARTNER" | "PARTNER_CITY" | "PERIOD" | "PRICE_RANGE" | "TOTAL" | "%future added value";
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
export type Filters_filteredArtworks$data = Filters_filteredArtworks;
export type Filters_filteredArtworks$key = {
    readonly " $data"?: Filters_filteredArtworks$data;
    readonly " $fragmentRefs": FragmentRefs<"Filters_filteredArtworks">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Filters_filteredArtworks",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ArtworksAggregationResults",
      "kind": "LinkedField",
      "name": "aggregations",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "slice",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "AggregationCount",
          "kind": "LinkedField",
          "name": "counts",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "name",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "value",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "FilterArtworksConnection",
  "abstractKey": null
};
(node as any).hash = '91d31761bb4205fec2bf49fa49d6b080';
export default node;
