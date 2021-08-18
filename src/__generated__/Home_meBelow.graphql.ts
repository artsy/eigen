/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_meBelow = {
    readonly " $fragmentRefs": FragmentRefs<"AuctionResultsRail_me">;
    readonly " $refType": "Home_meBelow";
};
export type Home_meBelow$data = Home_meBelow;
export type Home_meBelow$key = {
    readonly " $data"?: Home_meBelow$data;
    readonly " $fragmentRefs": FragmentRefs<"Home_meBelow">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Home_meBelow",
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
(node as any).hash = 'f2820c2d61e098c095d9c0c22f3f3b73';
export default node;
