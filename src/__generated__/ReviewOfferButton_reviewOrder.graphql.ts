/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommerceOrderParticipantEnum = "BUYER" | "SELLER" | "%future added value";
export type CommerceOrderStateEnum = "ABANDONED" | "APPROVED" | "CANCELED" | "FULFILLED" | "PENDING" | "REFUNDED" | "SUBMITTED" | "%future added value";
export type ReviewOfferButton_reviewOrder = {
    readonly internalID: string;
    readonly state: CommerceOrderStateEnum;
    readonly stateReason: string | null;
    readonly stateExpiresAt: string | null;
    readonly lastOffer: {
        readonly fromParticipant: CommerceOrderParticipantEnum | null;
        readonly createdAt: string;
    } | null;
    readonly reviewOffers: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly internalID: string;
            } | null;
        } | null> | null;
    } | null;
    readonly __typename: "CommerceOfferOrder";
    readonly " $refType": "ReviewOfferButton_reviewOrder";
};
export type ReviewOfferButton_reviewOrder$data = ReviewOfferButton_reviewOrder;
export type ReviewOfferButton_reviewOrder$key = {
    readonly " $data"?: ReviewOfferButton_reviewOrder$data;
    readonly " $fragmentRefs": FragmentRefs<"ReviewOfferButton_reviewOrder">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ReviewOfferButton_reviewOrder",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    },
    (v0/*: any*/),
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
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "format",
          "value": "MMM D"
        }
      ],
      "kind": "ScalarField",
      "name": "stateExpiresAt",
      "storageKey": "stateExpiresAt(format:\"MMM D\")"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "CommerceOffer",
      "kind": "LinkedField",
      "name": "lastOffer",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "fromParticipant",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "createdAt",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": "reviewOffers",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 5
        }
      ],
      "concreteType": "CommerceOfferConnection",
      "kind": "LinkedField",
      "name": "offers",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "CommerceOfferEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "CommerceOffer",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v0/*: any*/)
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "offers(first:5)"
    }
  ],
  "type": "CommerceOfferOrder",
  "abstractKey": null
};
})();
(node as any).hash = '60b5d1eef63463213d50d5b140d75f41';
export default node;
