/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionAndSavedWorks_me = {
    readonly name: string | null;
    readonly createdAt: string | null;
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
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'd1878ad954966f69bd1fcaaafe704683';
export default node;
