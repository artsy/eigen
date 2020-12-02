/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Inbox_me = {
    readonly " $fragmentRefs": FragmentRefs<"Conversations_me" | "MyBids_me">;
    readonly " $refType": "Inbox_me";
};
export type Inbox_me$data = Inbox_me;
export type Inbox_me$key = {
    readonly " $data"?: Inbox_me$data;
    readonly " $fragmentRefs": FragmentRefs<"Inbox_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Inbox_me",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Conversations_me"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyBids_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'b952dbf9da84367f7fc3e4c8f65bb09e';
export default node;
