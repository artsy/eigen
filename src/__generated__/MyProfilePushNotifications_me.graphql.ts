/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfilePushNotifications_me = {
    readonly receiveLotOpeningSoonNotification: boolean | null;
    readonly receiveNewSalesNotification: boolean | null;
    readonly receiveNewWorksNotification: boolean | null;
    readonly receiveOutbidNotification: boolean | null;
    readonly receivePromotionNotification: boolean | null;
    readonly receivePurchaseNotification: boolean | null;
    readonly receiveSaleOpeningClosingNotification: boolean | null;
    readonly " $refType": "MyProfilePushNotifications_me";
};
export type MyProfilePushNotifications_me$data = MyProfilePushNotifications_me;
export type MyProfilePushNotifications_me$key = {
    readonly " $data"?: MyProfilePushNotifications_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyProfilePushNotifications_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyProfilePushNotifications_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receiveLotOpeningSoonNotification",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receiveNewSalesNotification",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receiveNewWorksNotification",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receiveOutbidNotification",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receivePromotionNotification",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receivePurchaseNotification",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "receiveSaleOpeningClosingNotification",
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '9a86ae477d68cf097cedcb77c5869a93';
export default node;
