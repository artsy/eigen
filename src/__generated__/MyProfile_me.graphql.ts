/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type MyProfile_me = {
    readonly name: string | null;
    readonly initials: string | null;
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
      "name": "initials",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'b0d654a679f1e4833dcf47729e29a6c1';
export default node;
