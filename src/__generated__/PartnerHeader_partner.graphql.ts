/* tslint:disable */
/* eslint-disable */

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
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "PartnerHeader_partner",
  "type": "Partner",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "profile",
      "storageKey": null,
      "args": null,
      "concreteType": "Profile",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "PartnerCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "eligibleArtworks",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "PartnerFollowButton_partner",
      "args": null
    }
  ]
};
})();
(node as any).hash = 'a4406e5249ed94182cc5dd8dd47921ff';
export default node;
