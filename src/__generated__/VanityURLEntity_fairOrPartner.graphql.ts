/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type VanityURLEntity_fairOrPartner = {
    readonly __typename: "Fair";
    readonly " $fragmentRefs": FragmentRefs<"Fair_fair">;
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



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "VanityURLEntity_fairOrPartner",
  "type": "VanityURLEntityType",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "InlineFragment",
      "type": "Fair",
      "selections": [
        (v0/*: any*/),
        {
          "kind": "FragmentSpread",
          "name": "Fair_fair",
          "args": null
        }
      ]
    },
    {
      "kind": "InlineFragment",
      "type": "Partner",
      "selections": [
        (v0/*: any*/),
        {
          "kind": "FragmentSpread",
          "name": "Partner_partner",
          "args": null
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'cff29c67c2f2bb38e6ad9c99cc014df0';
export default node;
