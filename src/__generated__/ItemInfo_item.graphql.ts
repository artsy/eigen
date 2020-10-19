/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ItemInfo_item = {
    readonly __typename: "Artwork";
    readonly href: string | null;
    readonly image: {
        readonly thumbnailUrl: string | null;
    } | null;
    readonly title: string | null;
    readonly artistNames: string | null;
    readonly date: string | null;
    readonly saleMessage: string | null;
    readonly partner: {
        readonly name: string | null;
    } | null;
    readonly " $refType": "ItemInfo_item";
} | {
    readonly __typename: "Show";
    readonly name: string | null;
    readonly href: string | null;
    readonly exhibitionPeriod: string | null;
    readonly partner: {
        readonly name?: string | null;
    } | null;
    readonly image: {
        readonly thumbnailUrl: string | null;
    } | null;
    readonly " $refType": "ItemInfo_item";
} | {
    /*This will never be '%other', but we need some
    value in case none of the concrete values match.*/
    readonly __typename: "%other";
    readonly " $refType": "ItemInfo_item";
};
export type ItemInfo_item$data = ItemInfo_item;
export type ItemInfo_item$key = {
    readonly " $data"?: ItemInfo_item$data;
    readonly " $fragmentRefs": FragmentRefs<"ItemInfo_item">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v1 = [
  {
    "alias": "thumbnailUrl",
    "args": [
      {
        "kind": "Literal",
        "name": "version",
        "value": "small"
      }
    ],
    "kind": "ScalarField",
    "name": "url",
    "storageKey": "url(version:\"small\")"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  (v2/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ItemInfo_item",
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
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Image",
          "kind": "LinkedField",
          "name": "image",
          "plural": false,
          "selections": (v1/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "title",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "artistNames",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "date",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "saleMessage",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Partner",
          "kind": "LinkedField",
          "name": "partner",
          "plural": false,
          "selections": (v3/*: any*/),
          "storageKey": null
        }
      ],
      "type": "Artwork",
      "abstractKey": null
    },
    {
      "kind": "InlineFragment",
      "selections": [
        (v2/*: any*/),
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "exhibitionPeriod",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": null,
          "kind": "LinkedField",
          "name": "partner",
          "plural": false,
          "selections": [
            {
              "kind": "InlineFragment",
              "selections": (v3/*: any*/),
              "type": "Partner",
              "abstractKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": "image",
          "args": null,
          "concreteType": "Image",
          "kind": "LinkedField",
          "name": "coverImage",
          "plural": false,
          "selections": (v1/*: any*/),
          "storageKey": null
        }
      ],
      "type": "Show",
      "abstractKey": null
    }
  ],
  "type": "ConversationItemType",
  "abstractKey": "__isConversationItemType"
};
})();
(node as any).hash = 'e90dc97ffd305be522c5b14aa96cd76e';
export default node;
