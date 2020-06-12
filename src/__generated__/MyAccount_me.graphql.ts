/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyAccount_me = {
    readonly name: string | null;
    readonly email: string | null;
    readonly phone: string | null;
    readonly paddleNumber: string | null;
    readonly " $refType": "MyAccount_me";
};
export type MyAccount_me$data = MyAccount_me;
export type MyAccount_me$key = {
    readonly " $data"?: MyAccount_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyAccount_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyAccount_me",
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
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "email",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "phone",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "paddleNumber",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '6da16c4f0f15c408c0a36c3ef70aebe5';
export default node;
