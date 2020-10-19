/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RegistrationFlow_sale = {
    readonly " $fragmentRefs": FragmentRefs<"Registration_sale">;
    readonly " $refType": "RegistrationFlow_sale";
};
export type RegistrationFlow_sale$data = RegistrationFlow_sale;
export type RegistrationFlow_sale$key = {
    readonly " $data"?: RegistrationFlow_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"RegistrationFlow_sale">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RegistrationFlow_sale",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Registration_sale"
    }
  ],
  "type": "Sale",
  "abstractKey": null
};
(node as any).hash = 'fcde945a17ddfb4a7424a6691566c9f9';
export default node;
