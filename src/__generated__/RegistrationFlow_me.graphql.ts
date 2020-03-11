/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RegistrationFlow_me = {
    readonly " $fragmentRefs": FragmentRefs<"Registration_me">;
    readonly " $refType": "RegistrationFlow_me";
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
