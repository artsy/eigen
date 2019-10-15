/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _AuctionCountDownTimer_artwork$ref: unique symbol;
export type AuctionCountDownTimer_artwork$ref = typeof _AuctionCountDownTimer_artwork$ref;
export type AuctionCountDownTimer_artwork = {
    readonly sale: {
        readonly startAt: string | null;
        readonly endAt: string | null;
        readonly liveStartAt: string | null;
    } | null;
    readonly " $refType": AuctionCountDownTimer_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "AuctionCountDownTimer_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "sale",
      "storageKey": null,
      "args": null,
      "concreteType": "Sale",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "startAt",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "endAt",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "liveStartAt",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '367f8f9c5035c2571ce71fcf263f48c6';
export default node;
