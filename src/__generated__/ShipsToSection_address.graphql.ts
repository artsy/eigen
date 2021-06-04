/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShipsToSection_address = {
    readonly requestedFulfillment: {
        readonly addressLine1?: string | null;
        readonly addressLine2?: string | null;
        readonly city?: string | null;
        readonly country?: string | null;
        readonly phoneNumber?: string | null;
        readonly postalCode?: string | null;
        readonly region?: string | null;
    } | null;
    readonly " $refType": "ShipsToSection_address";
};
export type ShipsToSection_address$data = ShipsToSection_address;
export type ShipsToSection_address$key = {
    readonly " $data"?: ShipsToSection_address$data;
    readonly " $fragmentRefs": FragmentRefs<"ShipsToSection_address">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShipsToSection_address",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "requestedFulfillment",
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "addressLine1",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "addressLine2",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "city",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "country",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "phoneNumber",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "postalCode",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "region",
              "storageKey": null
            }
          ],
          "type": "CommerceShip",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "CommerceOrder",
  "abstractKey": "__isCommerceOrder"
};
(node as any).hash = '54757664588c1244c2b7878e8fe6159f';
export default node;
