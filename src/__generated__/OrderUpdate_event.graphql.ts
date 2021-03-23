/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommerceOrderParticipantEnum = "BUYER" | "SELLER" | "%future added value";
export type CommerceOrderStateEnum = "ABANDONED" | "APPROVED" | "CANCELED" | "FULFILLED" | "PENDING" | "REFUNDED" | "SUBMITTED" | "%future added value";
export type OrderUpdate_event = {
    readonly __typename: "CommerceOrderStateChangedEvent";
    readonly createdAt: string;
    readonly stateReason: string | null;
    readonly state: CommerceOrderStateEnum;
    readonly " $refType": "OrderUpdate_event";
} | {
    readonly __typename: "CommerceOfferSubmittedEvent";
    readonly createdAt: string;
    readonly offer: {
        readonly amount: string | null;
        readonly fromParticipant: CommerceOrderParticipantEnum | null;
        readonly respondsTo: {
            readonly fromParticipant: CommerceOrderParticipantEnum | null;
        } | null;
    };
    readonly " $refType": "OrderUpdate_event";
} | {
    /*This will never be '%other', but we need some
    value in case none of the concrete values match.*/
    readonly __typename: "%other";
    readonly " $refType": "OrderUpdate_event";
};
export type OrderUpdate_event$data = OrderUpdate_event;
export type OrderUpdate_event$key = {
    readonly " $data"?: OrderUpdate_event$data;
    readonly " $fragmentRefs": FragmentRefs<"OrderUpdate_event">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
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
  "name": "OrderUpdate_event",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "stateReason",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "state",
          "storageKey": null
        }
      ],
      "type": "CommerceOrderStateChangedEvent",
      "abstractKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "CommerceOffer",
          "kind": "LinkedField",
          "name": "offer",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "amount",
              "storageKey": null
            },
            (v1/*: any*/),
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
            }
          ],
          "storageKey": null
        }
      ],
      "type": "CommerceOfferSubmittedEvent",
      "abstractKey": null
    }
  ],
  "type": "CommerceOrderEventUnion",
  "abstractKey": "__isCommerceOrderEventUnion"
};
})();
(node as any).hash = '250f0d3f8e1f233d839dbbc7fac42f7c';
export default node;
