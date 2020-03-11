/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerHeader_partner = {
    readonly name: string | null;
    readonly profile: {
        readonly counts: {
            readonly follows: number | null;
        } | null;
    } | null;
    readonly counts: {
        readonly eligibleArtworks: number | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"PartnerFollowButton_partner">;
    readonly " $refType": "PartnerHeader_partner";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "PartnerHeader_partner",
  "type": "Partner",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "profile",
      "storageKey": null,
      "args": null,
      "concreteType": "Profile",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "counts",
          "storageKey": null,
          "args": null,
          "concreteType": "ProfileCounts",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "follows",
              "args": null,
              "storageKey": null
            }
          ]
        }
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
(node as any).hash = '0d2e014272c15fcda2efb36ab9941791';
export default node;
