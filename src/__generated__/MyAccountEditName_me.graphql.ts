/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyAccountEditName_me = {
    readonly name: string | null;
    readonly " $refType": "MyAccountEditName_me";
};
export type MyAccountEditName_me$data = MyAccountEditName_me;
export type MyAccountEditName_me$key = {
    readonly " $data"?: MyAccountEditName_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyAccountEditName_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyAccountEditName_me",
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
(node as any).hash = 'dbdfea98827c1e03f4535ce585dd243e';
export default node;
