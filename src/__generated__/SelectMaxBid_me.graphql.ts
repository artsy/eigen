/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ConfirmBid_me$ref } from "./ConfirmBid_me.graphql";
declare const _SelectMaxBid_me$ref: unique symbol;
export type SelectMaxBid_me$ref = typeof _SelectMaxBid_me$ref;
export type SelectMaxBid_me = {
    readonly " $fragmentRefs": ConfirmBid_me$ref;
    readonly " $refType": SelectMaxBid_me$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SelectMaxBid_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "ConfirmBid_me",
      "args": null
    }
  ]
};
(node as any).hash = 'a89deffbe0bc2e15f42b67f98064cfda';
export default node;
