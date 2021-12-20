/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ItemInfo_item = {
    readonly __typename: string;
    readonly " $fragmentRefs": FragmentRefs<"ItemArtwork_artwork" | "ItemShow_show">;
    readonly " $refType": "ItemInfo_item";
};
export type ItemInfo_item$data = ItemInfo_item;
export type ItemInfo_item$key = {
    readonly " $data"?: ItemInfo_item$data;
    readonly " $fragmentRefs": FragmentRefs<"ItemInfo_item">;
};



const node: ReaderFragment = {
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
      "args": null,
      "kind": "FragmentSpread",
      "name": "ItemArtwork_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ItemShow_show"
    }
  ],
  "type": "ConversationItemType",
  "abstractKey": "__isConversationItemType"
};
(node as any).hash = '956b078440c9cc5fa596b6fe5b69c5c4';
export default node;
