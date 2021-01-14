/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairEmptyState_fair = {
    readonly isActive: boolean | null;
    readonly endAt: string | null;
    readonly " $refType": "FairEmptyState_fair";
};
export type FairEmptyState_fair$data = FairEmptyState_fair;
export type FairEmptyState_fair$key = {
    readonly " $data"?: FairEmptyState_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"FairEmptyState_fair">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FairEmptyState_fair",
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
(node as any).hash = '0a03e1fa92ef01b0d307471ac69588f3';
export default node;
