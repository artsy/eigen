/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type VanityURLEntity_fairOrPartner = {
    readonly __typename: "Fair";
    readonly slug: string;
    readonly " $fragmentRefs": FragmentRefs<"Fair2_fair" | "Fair_fair">;
    readonly " $refType": "VanityURLEntity_fairOrPartner";
} | {
    readonly __typename: "Partner";
    readonly " $fragmentRefs": FragmentRefs<"Partner_partner">;
    readonly " $refType": "VanityURLEntity_fairOrPartner";
} | {
    /*This will never be '%other', but we need some
    value in case none of the concrete values match.*/
    readonly __typename: "%other";
    readonly " $refType": "VanityURLEntity_fairOrPartner";
};
export type VanityURLEntity_fairOrPartner$data = VanityURLEntity_fairOrPartner;
export type VanityURLEntity_fairOrPartner$key = {
    readonly " $data"?: VanityURLEntity_fairOrPartner$data;
    readonly " $fragmentRefs": FragmentRefs<"VanityURLEntity_fairOrPartner">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": false,
      "kind": "LocalArgument",
      "name": "useNewFairView"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "VanityURLEntity_fairOrPartner",
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
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "slug",
          "storageKey": null
        },
        {
          "condition": "useNewFairView",
          "kind": "Condition",
          "passingValue": true,
          "selections": [
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "Fair2_fair"
            }
          ]
        },
        {
          "condition": "useNewFairView",
          "kind": "Condition",
          "passingValue": false,
          "selections": [
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "Fair_fair"
            }
          ]
        }
      ],
      "type": "Fair",
      "abstractKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "Partner_partner"
        }
      ],
      "type": "Partner",
      "abstractKey": null
    }
  ],
  "type": "VanityURLEntityType",
  "abstractKey": "__isVanityURLEntityType"
};
(node as any).hash = 'd887180404e9d331b968e01d820aa307';
export default node;
