/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShipsToSection_address = {
    readonly requestedFulfillment: ({
        readonly __typename: "CommercePickup";
    } | {
        readonly __typename: "CommerceShip";
        readonly addressLine1: string | null;
        readonly addressLine2: string | null;
        readonly city: string | null;
        readonly country: string | null;
        readonly phoneNumber: string | null;
        readonly postalCode: string | null;
        readonly region: string | null;
    } | {
        readonly __typename: "CommerceShipArta";
        readonly addressLine1: string | null;
        readonly addressLine2: string | null;
        readonly city: string | null;
        readonly country: string | null;
        readonly phoneNumber: string | null;
        readonly postalCode: string | null;
        readonly region: string | null;
    } | {
        /*This will never be '%other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
    readonly " $refType": "ShipsToSection_address";
};
export type ShipsToSection_address$data = ShipsToSection_address;
export type ShipsToSection_address$key = {
    readonly " $data"?: ShipsToSection_address$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"ShipsToSection_address">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v1 = [
  (v0/*: any*/),
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
];
return {
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
            (v0/*: any*/)
          ],
          "type": "CommercePickup",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": (v1/*: any*/),
          "type": "CommerceShip",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": (v1/*: any*/),
          "type": "CommerceShipArta",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "CommerceOrder",
  "abstractKey": "__isCommerceOrder"
};
})();
(node as any).hash = '6fcb7091e71d3ec76e0b818ef870c45c';
export default node;
