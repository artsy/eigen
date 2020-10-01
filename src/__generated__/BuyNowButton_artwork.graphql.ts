/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type BuyNowButton_artwork = {
    readonly internalID: string;
    readonly saleMessage: string | null;
    readonly " $refType": "BuyNowButton_artwork";
};
export type BuyNowButton_artwork$data = BuyNowButton_artwork;
export type BuyNowButton_artwork$key = {
    readonly " $data"?: BuyNowButton_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"BuyNowButton_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BuyNowButton_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "saleMessage",
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '609e0283817ad640023edf88297f5f0a';
export default node;
