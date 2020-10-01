/* tslint:disable */
/* eslint-disable */

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
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v1 = [
  {
    "kind": "ScalarField",
    "alias": "thumbnailUrl",
    "name": "url",
    "args": [
      {
        "kind": "Literal",
        "name": "version",
        "value": "small"
      }
    ],
    "storageKey": "url(version:\"small\")"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = [
  (v2/*: any*/)
];
return {
  "kind": "Fragment",
  "name": "ItemInfo_item",
  "type": "ConversationItemType",
  "metadata": null,
  "argumentDefinitions": [],
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
      "type": "Artwork",
      "selections": [
        (v0/*: any*/),
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "image",
          "storageKey": null,
          "args": null,
          "concreteType": "Image",
          "plural": false,
          "selections": (v1/*: any*/)
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "title",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artistNames",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "date",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "saleMessage",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "partner",
          "storageKey": null,
          "args": null,
          "concreteType": "Partner",
          "plural": false,
          "selections": (v3/*: any*/)
        }
      ]
    },
    {
      "kind": "InlineFragment",
      "type": "Show",
      "selections": [
        (v2/*: any*/),
        (v0/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "exhibitionPeriod",
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
              "selections": (v3/*: any*/)
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": "image",
          "name": "coverImage",
          "storageKey": null,
          "args": null,
          "concreteType": "Image",
          "plural": false,
          "selections": (v1/*: any*/)
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'e90dc97ffd305be522c5b14aa96cd76e';
export default node;
