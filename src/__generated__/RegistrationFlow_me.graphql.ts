/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type RegistrationFlow_me = {
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "RegistrationFlow_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Registration_me",
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
(node as any).hash = 'ce336fcd6db87f05e811b45bcfaa9186';
export default node;
