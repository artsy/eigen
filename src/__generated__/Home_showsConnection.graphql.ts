/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_showsConnection = {
    readonly " $fragmentRefs": FragmentRefs<"ShowsRail_showsConnection">;
    readonly " $refType": "Home_showsConnection";
};
export type Home_showsConnection$data = Home_showsConnection;
export type Home_showsConnection$key = {
    readonly " $data"?: Home_showsConnection$data;
    readonly " $fragmentRefs": FragmentRefs<"Home_showsConnection">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Home_showsConnection",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShowsRail_showsConnection"
    }
  ],
  "type": "ShowConnection",
  "abstractKey": null
};
(node as any).hash = '6e5205aaf3084a49c8f19a13a6a24493';
export default node;
