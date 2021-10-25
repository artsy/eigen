/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionAndSavedWorks_me = {
    readonly name: string | null;
    readonly createdAt: string | null;
    readonly " $fragmentRefs": FragmentRefs<"MyProfileEditFormModal_me">;
    readonly " $refType": "MyCollectionAndSavedWorks_me";
};
export type MyCollectionAndSavedWorks_me$data = MyCollectionAndSavedWorks_me;
export type MyCollectionAndSavedWorks_me$key = {
    readonly " $data"?: MyCollectionAndSavedWorks_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionAndSavedWorks_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionAndSavedWorks_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyProfileEditFormModal_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'fe765d786232c7ff6ee29ed401338661';
export default node;
