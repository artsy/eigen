/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type BidButton_me = {
    readonly identityVerified: boolean | null;
    readonly " $refType": "BidButton_me";
};
export type BidButton_me$data = BidButton_me;
export type BidButton_me$key = {
    readonly " $data"?: BidButton_me$data;
    readonly " $fragmentRefs": FragmentRefs<"BidButton_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BidButton_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "identityVerified",
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '4a1c7e4593abf1b3b1ab07a71a03457b';
export default node;
