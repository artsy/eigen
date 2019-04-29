/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _MyProfile_me$ref: unique symbol;
export type MyProfile_me$ref = typeof _MyProfile_me$ref;
export type MyProfile_me = {
    readonly name: string | null;
    readonly initials: string | null;
    readonly " $refType": MyProfile_me$ref;
};



const node: ConcreteFragment = {
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
    },
    {
      "kind": "ScalarField",
      "alias": "__id",
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'b0d654a679f1e4833dcf47729e29a6c1';
export default node;
