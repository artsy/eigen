/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleCard_me = {
    readonly identityVerified: boolean | null;
    readonly pendingIdentityVerification: {
        readonly internalID: string;
    } | null;
    readonly " $refType": "SaleCard_me";
};
export type SaleCard_me$data = SaleCard_me;
export type SaleCard_me$key = {
    readonly " $data"?: SaleCard_me$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleCard_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SaleCard_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "identityVerified",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "IdentityVerification",
      "kind": "LinkedField",
      "name": "pendingIdentityVerification",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "internalID",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'da5215e9b11f0f67796216adeb98318e';
export default node;
