/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyAccountEditPhone_me = {
    readonly phone: string | null;
    readonly " $refType": "MyAccountEditPhone_me";
};
export type MyAccountEditPhone_me$data = MyAccountEditPhone_me;
export type MyAccountEditPhone_me$key = {
    readonly " $data"?: MyAccountEditPhone_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyAccountEditPhone_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyAccountEditPhone_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "phone",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '9c918fc47dc1841425f5488d2c307f2e';
export default node;
