/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "MyAccountEditEmail_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "email",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '18e2f212786da91f965d1384aaae9239';
export default node;
