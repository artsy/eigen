/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistInsights_priceInsights = {
    readonly " $fragmentRefs": FragmentRefs<"MarketStats_priceInsights">;
    readonly " $refType": "ArtistInsights_priceInsights";
};
export type ArtistInsights_priceInsights$data = ArtistInsights_priceInsights;
export type ArtistInsights_priceInsights$key = {
    readonly " $data"?: ArtistInsights_priceInsights$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistInsights_priceInsights">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistInsights_priceInsights",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MarketStats_priceInsights"
    }
  ],
  "type": "PriceInsightConnection",
  "abstractKey": null
};
(node as any).hash = 'a65b7be3cc9ec7eeae4d876734315855';
export default node;
