/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2Timing_fair = {
    readonly exhibitionPeriod: string | null;
    readonly startAt: string | null;
    readonly endAt: string | null;
    readonly " $refType": "Fair2Timing_fair";
};
export type Fair2Timing_fair$data = Fair2Timing_fair;
export type Fair2Timing_fair$key = {
    readonly " $data"?: Fair2Timing_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2Timing_fair">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Fair2Timing_fair",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "exhibitionPeriod",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startAt",
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
(node as any).hash = 'aa6e85b8aaec3370047ba4a0ffcc64c0';
export default node;
