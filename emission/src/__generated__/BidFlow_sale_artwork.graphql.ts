/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type BidFlow_sale_artwork = {
    readonly " $fragmentRefs": FragmentRefs<"SelectMaxBid_sale_artwork">;
    readonly " $refType": "BidFlow_sale_artwork";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "BidFlow_sale_artwork",
  "type": "SaleArtwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "SelectMaxBid_sale_artwork",
      "args": null
    }
  ]
};
(node as any).hash = '783deb640df28b5155fc21968460a57c';
export default node;
