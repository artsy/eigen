/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type RegistrationFlow_sale = {};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "RegistrationFlow_sale",
  "type": "Sale",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Registration_sale",
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
(node as any).hash = 'fcde945a17ddfb4a7424a6691566c9f9';
export default node;
