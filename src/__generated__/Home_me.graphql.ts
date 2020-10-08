/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_me = {
    readonly " $fragmentRefs": FragmentRefs<"EmailConfirmationBanner_me">;
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
      "name": "EmailConfirmationBanner_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'feadcdd0067e069b5ac90c439c54299a';
export default node;
