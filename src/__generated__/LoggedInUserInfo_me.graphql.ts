/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LoggedInUserInfo_me = {
    readonly name: string | null;
    readonly email: string | null;
    readonly " $refType": "LoggedInUserInfo_me";
};
export type LoggedInUserInfo_me$data = LoggedInUserInfo_me;
export type LoggedInUserInfo_me$key = {
    readonly " $data"?: LoggedInUserInfo_me$data;
    readonly " $fragmentRefs": FragmentRefs<"LoggedInUserInfo_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LoggedInUserInfo_me",
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
      "name": "email",
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '3f8a214bac317a12a0137e848174b735';
export default node;
