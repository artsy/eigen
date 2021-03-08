/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommerceOrderParticipantEnum = "BUYER" | "SELLER" | "%future added value";
export type CommerceOrderStateEnum = "ABANDONED" | "APPROVED" | "CANCELED" | "FULFILLED" | "PENDING" | "REFUNDED" | "SUBMITTED" | "%future added value";
export type OfferNotification_offer = {
    readonly amount: string | null;
    readonly createdAt: string;
    readonly fromParticipant: CommerceOrderParticipantEnum | null;
    readonly from: {
        readonly __typename: string;
    };
    readonly respondsTo: {
        readonly fromParticipant: CommerceOrderParticipantEnum | null;
    } | null;
    readonly order: {
        readonly state: CommerceOrderStateEnum;
        readonly stateReason: string | null;
    };
    readonly __typename: "CommerceOffer";
    readonly " $refType": "OfferNotification_offer";
};
export type OfferNotification_offer$data = OfferNotification_offer;
export type OfferNotification_offer$key = {
    readonly " $data"?: OfferNotification_offer$data;
    readonly " $fragmentRefs": FragmentRefs<"OfferNotification_offer">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fromParticipant",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OfferNotification_offer",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "amount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "from",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "CommerceOffer",
      "kind": "LinkedField",
      "name": "respondsTo",
      "plural": false,
      "selections": [
        (v1/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "order",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "state",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "stateReason",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "CommerceOffer",
  "abstractKey": null
};
})();
(node as any).hash = '2addcd8900ec65debf5be9b74ebd2cbb';
export default node;
