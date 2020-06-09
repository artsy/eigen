/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfile_me = {
    readonly name: string | null;
    readonly " $refType": "MyProfile_me";
};
export type MyProfile_me$data = MyProfile_me;
export type MyProfile_me$key = {
    readonly " $data"?: MyProfile_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyProfile_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyProfile_me",
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
(node as any).hash = 'ef50d258e2b41b592576c7ccf64c6c19';
export default node;
