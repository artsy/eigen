/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { Registration_sale$ref } from "./Registration_sale.graphql";
declare const _RegistrationFlow_sale$ref: unique symbol;
export type RegistrationFlow_sale$ref = typeof _RegistrationFlow_sale$ref;
export type RegistrationFlow_sale = {
    readonly " $fragmentRefs": Registration_sale$ref;
    readonly " $refType": RegistrationFlow_sale$ref;
};



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
      "alias": "__id",
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'fcde945a17ddfb4a7424a6691566c9f9';
export default node;
