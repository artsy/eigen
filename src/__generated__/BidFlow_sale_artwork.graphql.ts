/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type BidFlow_sale_artwork = {
    readonly " $fragmentRefs": FragmentRefs<"SelectMaxBid_sale_artwork" | "ConfirmBid_sale_artwork" | "BidResult_sale_artwork">;
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ConfirmBid_sale_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "BidResult_sale_artwork"
    }
  ],
  "type": "SaleArtwork",
  "abstractKey": null
};
(node as any).hash = 'bd72a9440592319c0b521d954d9c5ed7';
export default node;
