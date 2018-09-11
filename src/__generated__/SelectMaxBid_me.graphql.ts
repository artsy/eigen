/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type SelectMaxBid_me = {};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "SelectMaxBid_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "ConfirmBid_me",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'a89deffbe0bc2e15f42b67f98064cfda';
export default node;
