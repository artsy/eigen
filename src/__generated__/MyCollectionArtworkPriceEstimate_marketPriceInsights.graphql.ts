/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkPriceEstimate_marketPriceInsights = {
    readonly annualLotsSold: number | null;
    readonly " $refType": "MyCollectionArtworkPriceEstimate_marketPriceInsights";
};
export type MyCollectionArtworkPriceEstimate_marketPriceInsights$data = MyCollectionArtworkPriceEstimate_marketPriceInsights;
export type MyCollectionArtworkPriceEstimate_marketPriceInsights$key = {
    readonly " $data"?: MyCollectionArtworkPriceEstimate_marketPriceInsights$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkPriceEstimate_marketPriceInsights">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkPriceEstimate_marketPriceInsights",
  "type": "MarketPriceInsights",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "annualLotsSold",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'cb99bf94f6e46b6ddb73efeed621a740';
export default node;
