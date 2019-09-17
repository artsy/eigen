/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _AuctionCountDownTimer_artwork$ref: unique symbol;
export type AuctionCountDownTimer_artwork$ref = typeof _AuctionCountDownTimer_artwork$ref;
export type AuctionCountDownTimer_artwork = {
    readonly sale: {
        readonly startAt: string | null;
        readonly endAt: string | null;
        readonly formattedStartDateTime: string | null;
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
          "name": "formattedStartDateTime",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '684a015d3d26b472450ed056a952464a';
export default node;
