/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Registration_me = {
    readonly hasCreditCards: boolean | null;
    readonly identityVerified: boolean | null;
    readonly " $refType": "Registration_me";
};
export type Registration_me$data = Registration_me;
export type Registration_me$key = {
    readonly " $data"?: Registration_me$data;
    readonly " $fragmentRefs": FragmentRefs<"Registration_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Registration_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasCreditCards",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "identityVerified",
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'e663b74c89150cc66e416da3aedaffd4';
export default node;
