/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RegistrationFlow_me = {
    readonly " $fragmentRefs": FragmentRefs<"Registration_me">;
    readonly " $refType": "RegistrationFlow_me";
};
export type RegistrationFlow_me$data = RegistrationFlow_me;
export type RegistrationFlow_me$key = {
    readonly " $data"?: RegistrationFlow_me$data;
    readonly " $fragmentRefs": FragmentRefs<"RegistrationFlow_me">;
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
