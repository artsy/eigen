/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "MyProfilePushNotifications_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "receiveLotOpeningSoonNotification",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "receiveNewSalesNotification",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "receiveNewWorksNotification",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "receiveOutbidNotification",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "receivePromotionNotification",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "receivePurchaseNotification",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "receiveSaleOpeningClosingNotification",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '9a86ae477d68cf097cedcb77c5869a93';
export default node;
