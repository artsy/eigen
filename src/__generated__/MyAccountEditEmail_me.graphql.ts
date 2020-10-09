/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyAccountEditEmail_me = {
    readonly email: string | null;
    readonly " $refType": "MyAccountEditEmail_me";
};
export type MyAccountEditEmail_me$data = MyAccountEditEmail_me;
export type MyAccountEditEmail_me$key = {
    readonly " $data"?: MyAccountEditEmail_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyAccountEditEmail_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyAccountEditEmail_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "email",
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '18e2f212786da91f965d1384aaae9239';
export default node;
