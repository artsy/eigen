/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type MyProfile_me = {
    readonly name: string | null;
    readonly email: string | null;
    readonly " $refType": "MyProfile_me";
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
(node as any).hash = '5e9f6839a678820407b92caf72011056';
export default node;
