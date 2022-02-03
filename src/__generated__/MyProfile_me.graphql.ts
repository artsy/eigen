/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfile_me = {
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionAndSavedWorks_me" | "MyProfileEditForm_me">;
    readonly " $refType": "MyProfile_me";
};
export type MyProfile_me$data = MyProfile_me;
export type MyProfile_me$key = {
    readonly " $data"?: MyProfile_me$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"MyProfile_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyProfile_me",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyCollectionAndSavedWorks_me"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyProfileEditForm_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'bcc7d9df27c07733c099bac8e6f11a2c';
export default node;
