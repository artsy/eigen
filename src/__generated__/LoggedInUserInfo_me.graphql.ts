/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "LoggedInUserInfo_me",
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
    }
  ]
};
(node as any).hash = '3f8a214bac317a12a0137e848174b735';
export default node;
