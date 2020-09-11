/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RegisterToBidButton_sale = {
    readonly slug: string;
    readonly startAt: string | null;
    readonly endAt: string | null;
    readonly requireIdentityVerification: boolean | null;
    readonly registrationStatus: {
        readonly qualifiedForBidding: boolean | null;
    } | null;
    readonly " $refType": "RegisterToBidButton_sale";
};
export type RegisterToBidButton_sale$data = RegisterToBidButton_sale;
export type RegisterToBidButton_sale$key = {
    readonly " $data"?: RegisterToBidButton_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"RegisterToBidButton_sale">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "RegisterToBidButton_sale",
  "type": "Sale",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "startAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "endAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "requireIdentityVerification",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "registrationStatus",
      "storageKey": null,
      "args": null,
      "concreteType": "Bidder",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "qualifiedForBidding",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '1dce249f87a8c895f8d854c78caf2813';
export default node;
