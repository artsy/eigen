/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SelectMaxBid_me = {
    readonly " $fragmentRefs": FragmentRefs<"ConfirmBid_me">;
    readonly " $refType": "SelectMaxBid_me";
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
