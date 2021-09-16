/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfileSettings_me = {
    readonly labFeatures: ReadonlyArray<string>;
    readonly " $refType": "MyProfileSettings_me";
};
export type MyProfileSettings_me$data = MyProfileSettings_me;
export type MyProfileSettings_me$key = {
    readonly " $data"?: MyProfileSettings_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyProfileSettings_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyProfileSettings_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "labFeatures",
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '7a0b7e9d52ec52f868f31eddcd61d522';
export default node;
