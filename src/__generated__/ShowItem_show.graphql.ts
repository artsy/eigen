/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowItem_show = {
    readonly internalID: string;
    readonly slug: string;
    readonly name: string | null;
    readonly exhibition_period: string | null;
    readonly end_at: string | null;
    readonly images: ReadonlyArray<{
        readonly url: string | null;
    } | null> | null;
    readonly partner: {
        readonly name?: string | null;
    } | null;
    readonly " $refType": "ShowItem_show";
};
export type ShowItem_show$data = ShowItem_show;
export type ShowItem_show$key = {
    readonly " $data"?: ShowItem_show$data;
    readonly " $fragmentRefs": FragmentRefs<"ShowItem_show">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShowItem_show",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "alias": "exhibition_period",
      "args": null,
      "kind": "ScalarField",
      "name": "exhibitionPeriod",
      "storageKey": null
    },
    {
      "alias": "end_at",
      "args": null,
      "kind": "ScalarField",
      "name": "endAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "images",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "url",
          "storageKey": null
        }
      ],
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
          "selections": [
            (v0/*: any*/)
          ],
          "type": "Partner",
          "abstractKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Show",
  "abstractKey": null
};
})();
(node as any).hash = '0e5b8437d01a545b7dafb191fe889a4a';
export default node;
