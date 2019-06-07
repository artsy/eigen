/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _FollowPartnerButton_partner$ref: unique symbol;
export type FollowPartnerButton_partner$ref = typeof _FollowPartnerButton_partner$ref;
export type FollowPartnerButton_partner = {
    readonly name: string | null;
    readonly gravityID: string;
    readonly internalID: string;
    readonly id: string;
    readonly href: string | null;
    readonly profile: {
        readonly internalID: string;
        readonly gravityID: string;
        readonly is_followed: boolean | null;
    } | null;
    readonly " $refType": FollowPartnerButton_partner$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "FollowPartnerButton_partner",
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
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "href",
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
        (v1/*: any*/),
        (v0/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "is_followed",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
})();
(node as any).hash = '4f7ef8859d12dd410133d11f4453a0d2';
export default node;
