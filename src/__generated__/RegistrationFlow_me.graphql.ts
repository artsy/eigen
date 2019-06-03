/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { Registration_me$ref } from "./Registration_me.graphql";
declare const _RegistrationFlow_me$ref: unique symbol;
export type RegistrationFlow_me$ref = typeof _RegistrationFlow_me$ref;
export type RegistrationFlow_me = {
    readonly " $fragmentRefs": Registration_me$ref;
    readonly " $refType": RegistrationFlow_me$ref;
};



const node: ReaderFragment = {
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
    }
  ]
};
(node as any).hash = 'ce336fcd6db87f05e811b45bcfaa9186';
export default node;
