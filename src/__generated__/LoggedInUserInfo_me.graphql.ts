/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type LoggedInUserInfo_me = {
    readonly name: string | null;
    readonly email: string | null;
    readonly " $refType": "LoggedInUserInfo_me";
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
