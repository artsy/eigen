/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Registration_me",
  "selections": [
    {
      "alias": "has_credit_cards",
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
(node as any).hash = 'a9106c7ec262a05098449c8262c05fb4';
export default node;
