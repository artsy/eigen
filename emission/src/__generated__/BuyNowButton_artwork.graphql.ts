/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type BuyNowButton_artwork = {
    readonly internalID: string;
    readonly saleMessage: string | null;
    readonly " $refType": "BuyNowButton_artwork";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "BuyNowButton_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "saleMessage",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '609e0283817ad640023edf88297f5f0a';
export default node;
