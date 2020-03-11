/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RegistrationFlow_sale = {
    readonly " $fragmentRefs": FragmentRefs<"Registration_sale">;
    readonly " $refType": "RegistrationFlow_sale";
};



const node: ReaderFragment = {
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
    }
  ]
};
(node as any).hash = 'fcde945a17ddfb4a7424a6691566c9f9';
export default node;
