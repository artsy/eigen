/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2EmptyState_fair = {
    readonly isActive: boolean | null;
    readonly endAt: string | null;
    readonly " $refType": "Fair2EmptyState_fair";
};
export type Fair2EmptyState_fair$data = Fair2EmptyState_fair;
export type Fair2EmptyState_fair$key = {
    readonly " $data"?: Fair2EmptyState_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2EmptyState_fair">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Fair2EmptyState_fair",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isActive",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endAt",
      "storageKey": null
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
(node as any).hash = '4f7795640619b36dc159d118d94a9559';
export default node;
