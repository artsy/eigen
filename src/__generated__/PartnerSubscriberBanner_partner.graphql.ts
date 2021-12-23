/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerSubscriberBanner_partner = {
    readonly name: string | null;
    readonly hasFairPartnership: boolean | null;
    readonly " $refType": "PartnerSubscriberBanner_partner";
};
export type PartnerSubscriberBanner_partner$data = PartnerSubscriberBanner_partner;
export type PartnerSubscriberBanner_partner$key = {
    readonly " $data"?: PartnerSubscriberBanner_partner$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"PartnerSubscriberBanner_partner">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PartnerSubscriberBanner_partner",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasFairPartnership",
      "storageKey": null
    }
  ],
  "type": "Partner",
  "abstractKey": null
};
(node as any).hash = 'cd29183c26bfd1f6c809b4656179e0e9';
export default node;
