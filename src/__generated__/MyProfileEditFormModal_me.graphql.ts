/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfileEditFormModal_me = {
    readonly name: string | null;
    readonly " $refType": "MyProfileEditFormModal_me";
};
export type MyProfileEditFormModal_me$data = MyProfileEditFormModal_me;
export type MyProfileEditFormModal_me$key = {
    readonly " $data"?: MyProfileEditFormModal_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyProfileEditFormModal_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyProfileEditFormModal_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '521297571988b37a3026b794648ebcb2';
export default node;
