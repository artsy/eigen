/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Registration_me = {
    readonly has_credit_cards: boolean | null;
    readonly identityVerified: boolean | null;
    readonly " $refType": "Registration_me";
};
export type Registration_me$data = Registration_me;
export type Registration_me$key = {
    readonly " $data"?: Registration_me$data;
    readonly " $fragmentRefs": FragmentRefs<"Registration_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Registration_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": "has_credit_cards",
      "name": "hasCreditCards",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "identityVerified",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'a9106c7ec262a05098449c8262c05fb4';
export default node;
