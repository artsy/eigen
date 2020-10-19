/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type BidFlow_sale_artwork = {
    readonly " $fragmentRefs": FragmentRefs<"SelectMaxBid_sale_artwork">;
    readonly " $refType": "BidFlow_sale_artwork";
};
export type BidFlow_sale_artwork$data = BidFlow_sale_artwork;
export type BidFlow_sale_artwork$key = {
    readonly " $data"?: BidFlow_sale_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"BidFlow_sale_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BidFlow_sale_artwork",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SelectMaxBid_sale_artwork"
    }
  ],
  "type": "SaleArtwork",
  "abstractKey": null
};
(node as any).hash = '783deb640df28b5155fc21968460a57c';
export default node;
