/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ContextCard_artwork$ref: unique symbol;
export type ContextCard_artwork$ref = typeof _ContextCard_artwork$ref;
export type ContextCard_artwork = {
    readonly id: string;
    readonly slug: string;
    readonly internalID: string;
    readonly context: ({
        readonly __typename: string;
        readonly id?: string;
        readonly name?: string | null;
        readonly href?: string | null;
        readonly formattedStartDateTime?: string | null;
        readonly cover_image?: {
            readonly url: string | null;
        } | null;
        readonly exhibition_period?: string | null;
        readonly image?: {
            readonly url: string | null;
        } | null;
    } & ({
        readonly __typename: "Sale";
        readonly id: string;
        readonly name: string | null;
        readonly href: string | null;
        readonly formattedStartDateTime: string | null;
        readonly cover_image: {
            readonly url: string | null;
        } | null;
    } | {
        readonly __typename: "Fair";
        readonly exhibition_period: string | null;
        readonly image: {
            readonly url: string | null;
        } | null;
    } | {
        /*This will never be '% other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    })) | null;
    readonly shows: ReadonlyArray<{
        readonly id: string;
        readonly name: string | null;
        readonly href: string | null;
        readonly slug: string;
        readonly internalID: string;
        readonly exhibition_period: string | null;
        readonly is_followed: boolean | null;
        readonly cover_image: {
            readonly url: string | null;
        } | null;
    } | null> | null;
    readonly " $refType": ContextCard_artwork$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v5 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }
],
v6 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "cover_image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v5/*: any*/)
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "exhibition_period",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ContextCard_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    (v2/*: any*/),
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "context",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
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
          "type": "Sale",
          "selections": [
            (v0/*: any*/),
            (v3/*: any*/),
            (v4/*: any*/),
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "formattedStartDateTime",
              "args": null,
              "storageKey": null
            },
            (v6/*: any*/)
          ]
        },
        {
          "kind": "InlineFragment",
          "type": "Fair",
          "selections": [
            (v0/*: any*/),
            (v3/*: any*/),
            (v4/*: any*/),
            (v7/*: any*/),
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "image",
              "storageKey": null,
              "args": null,
              "concreteType": "Image",
              "plural": false,
              "selections": (v5/*: any*/)
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "shows",
      "storageKey": "shows(size:1)",
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 1
        }
      ],
      "concreteType": "Show",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        (v3/*: any*/),
        (v4/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        (v7/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "is_followed",
          "args": null,
          "storageKey": null
        },
        (v6/*: any*/)
      ]
    }
  ]
};
})();
(node as any).hash = 'c529ffbd1395a6331fdedfb67b7f8b17';
export default node;
