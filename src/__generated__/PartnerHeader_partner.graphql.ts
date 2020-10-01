/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerHeader_partner = {
    readonly name: string | null;
    readonly profile: {
        readonly name: string | null;
    } | null;
    readonly counts: {
        readonly eligibleArtworks: number | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"PartnerFollowButton_partner">;
    readonly " $refType": "PartnerHeader_partner";
};
export type PartnerHeader_partner$data = PartnerHeader_partner;
export type PartnerHeader_partner$key = {
    readonly " $data"?: PartnerHeader_partner$data;
    readonly " $fragmentRefs": FragmentRefs<"PartnerHeader_partner">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PartnerHeader_partner",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Profile",
      "kind": "LinkedField",
      "name": "profile",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "PartnerCounts",
      "kind": "LinkedField",
      "name": "counts",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "eligibleArtworks",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PartnerFollowButton_partner"
    }
  ],
  "type": "Partner",
  "abstractKey": null
};
})();
(node as any).hash = 'a4406e5249ed94182cc5dd8dd47921ff';
export default node;
