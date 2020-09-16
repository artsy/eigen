/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkInsights_artistInsights = {
    readonly annualLotsSold: number | null;
    readonly " $refType": "MyCollectionArtworkInsights_artistInsights";
};
export type MyCollectionArtworkInsights_artistInsights$data = MyCollectionArtworkInsights_artistInsights;
export type MyCollectionArtworkInsights_artistInsights$key = {
    readonly " $data"?: MyCollectionArtworkInsights_artistInsights$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkInsights_artistInsights">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkInsights_artistInsights",
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
(node as any).hash = '92fb848f83914878875e4d4716b709b4';
export default node;
