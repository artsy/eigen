/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_me = {
    readonly " $fragmentRefs": FragmentRefs<"AuctionResultsRail_me">;
    readonly " $refType": "Home_me";
};
export type Home_me$data = Home_me;
export type Home_me$key = {
    readonly " $data"?: Home_me$data;
    readonly " $fragmentRefs": FragmentRefs<"Home_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Home_me",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AuctionResultsRail_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'be37833f0619ca2c431976b51f5e0e80';
export default node;
