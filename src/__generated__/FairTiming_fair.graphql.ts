/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairTiming_fair = {
    readonly exhibitionPeriod: string | null;
    readonly startAt: string | null;
    readonly endAt: string | null;
    readonly " $refType": "FairTiming_fair";
};
export type FairTiming_fair$data = FairTiming_fair;
export type FairTiming_fair$key = {
    readonly " $data"?: FairTiming_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"FairTiming_fair">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FairTiming_fair",
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
(node as any).hash = '69ccf3ea7b14916f83f88714796d542f';
export default node;
