/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type PartnerCard_artwork = {
    readonly sale: {
        readonly isBenefit: boolean | null;
        readonly isGalleryAuction: boolean | null;
    } | null;
    readonly partner: {
        readonly cities: ReadonlyArray<string | null> | null;
        readonly is_default_profile_public: boolean | null;
        readonly type: string | null;
        readonly name: string | null;
        readonly slug: string;
        readonly id: string;
        readonly href: string | null;
        readonly initials: string | null;
        readonly profile: {
            readonly id: string;
            readonly internalID: string;
            readonly is_followed: boolean | null;
            readonly icon: {
                readonly url: string | null;
            } | null;
        } | null;
    } | null;
    readonly " $refType": "PartnerCard_artwork";
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "PartnerCard_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "sale",
      "storageKey": null,
      "args": null,
      "concreteType": "Sale",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isBenefit",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isGalleryAuction",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": "Partner",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "cities",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": "is_default_profile_public",
          "name": "isDefaultProfilePublic",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "type",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "slug",
          "args": null,
          "storageKey": null
        },
        (v0/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "href",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "initials",
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
            (v0/*: any*/),
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "internalID",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": "is_followed",
              "name": "isFollowed",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "icon",
              "storageKey": null,
              "args": null,
              "concreteType": "Image",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "url",
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "version",
                      "value": "square140"
                    }
                  ],
                  "storageKey": "url(version:\"square140\")"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'b2e7b624ea9963228683e0eda30525c1';
export default node;
