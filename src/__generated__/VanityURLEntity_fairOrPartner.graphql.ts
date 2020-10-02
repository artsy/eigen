/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type VanityURLEntity_fairOrPartner = {
    readonly __typename: "Fair";
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
  "kind": "Fragment",
  "name": "VanityURLEntity_fairOrPartner",
  "type": "VanityURLEntityType",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "useNewFairView",
      "type": "Boolean",
      "defaultValue": false
    }
  ],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__typename",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "InlineFragment",
      "type": "Fair",
      "selections": [
        {
          "kind": "Condition",
          "passingValue": true,
          "condition": "useNewFairView",
          "selections": [
            {
              "kind": "FragmentSpread",
              "name": "Fair2_fair",
              "args": null
            }
          ]
        },
        {
          "kind": "Condition",
          "passingValue": false,
          "condition": "useNewFairView",
          "selections": [
            {
              "kind": "FragmentSpread",
              "name": "Fair_fair",
              "args": null
            }
          ]
        }
      ]
    },
    {
      "kind": "InlineFragment",
      "type": "Partner",
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "Partner_partner",
          "args": null
        }
      ]
    }
  ]
};
(node as any).hash = 'a45efee3a131453bfba982b2610f0ade';
export default node;
