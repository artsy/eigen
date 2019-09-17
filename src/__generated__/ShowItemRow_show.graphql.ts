/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ShowItemRow_show$ref: unique symbol;
export type ShowItemRow_show$ref = typeof _ShowItemRow_show$ref;
export type ShowItemRow_show = {
    readonly id: string;
    readonly slug: string;
    readonly internalID: string;
    readonly is_followed: boolean | null;
    readonly name: string | null;
    readonly isStubShow: boolean | null;
    readonly partner: ({
        readonly name?: string | null;
        readonly profile?: {
            readonly image: {
                readonly url: string | null;
            } | null;
        } | null;
    } & ({
        readonly name: string | null;
        readonly profile: {
            readonly image: {
                readonly url: string | null;
            } | null;
        } | null;
    } | {
        /*This will never be '% other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    })) | null;
    readonly href: string | null;
    readonly exhibition_period: string | null;
    readonly status: string | null;
    readonly cover_image: {
        readonly url: string | null;
    } | null;
    readonly is_fair_booth: boolean | null;
    readonly end_at: string | null;
    readonly " $refType": ShowItemRow_show$ref;
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
  "name": "ShowItemRow_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "slug",
      "args": null,
      "storageKey": null
    },
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
    (v0/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isStubShow",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "type": "Partner",
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
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "image",
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
                          "value": "square"
                        }
                      ],
                      "storageKey": "url(version:\"square\")"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "href",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "exhibition_period",
      "name": "exhibitionPeriod",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "status",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "cover_image",
      "name": "coverImage",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": "is_fair_booth",
      "name": "isFairBooth",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "end_at",
      "name": "endAt",
      "args": null,
      "storageKey": null
    }
  ]
};
})();
(node as any).hash = '0bff9a002bbda9d71d8c4230f7c7b710';
export default node;
