/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "MyAccountEditName_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'dbdfea98827c1e03f4535ce585dd243e';
export default node;
