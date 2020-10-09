/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair_fair = {
    readonly id: string;
    readonly " $fragmentRefs": FragmentRefs<"FairDetail_fair">;
    readonly " $refType": "Fair_fair";
};
export type Fair_fair$data = Fair_fair;
export type Fair_fair$key = {
    readonly " $data"?: Fair_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair_fair">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Fair_fair",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FairDetail_fair"
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
(node as any).hash = '76379b672e62b0644edc02b901ea0bee';
export default node;
