/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SelectMaxBid_me = {
    readonly " $fragmentRefs": FragmentRefs<"ConfirmBid_me">;
    readonly " $refType": "SelectMaxBid_me";
};
export type SelectMaxBid_me$data = SelectMaxBid_me;
export type SelectMaxBid_me$key = {
    readonly " $data"?: SelectMaxBid_me$data;
    readonly " $fragmentRefs": FragmentRefs<"SelectMaxBid_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SelectMaxBid_me",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ConfirmBid_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'a89deffbe0bc2e15f42b67f98064cfda';
export default node;
