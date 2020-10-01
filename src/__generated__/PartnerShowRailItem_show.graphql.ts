/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerShowRailItem_show = {
    readonly internalID: string;
    readonly slug: string;
    readonly name: string | null;
    readonly exhibitionPeriod: string | null;
    readonly endAt: string | null;
    readonly coverImage: {
        readonly url: string | null;
    } | null;
    readonly images: ReadonlyArray<{
        readonly url: string | null;
    } | null> | null;
    readonly " $refType": "PartnerShowRailItem_show";
};
export type PartnerShowRailItem_show$data = PartnerShowRailItem_show;
export type PartnerShowRailItem_show$key = {
    readonly " $data"?: PartnerShowRailItem_show$data;
    readonly " $fragmentRefs": FragmentRefs<"PartnerShowRailItem_show">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "url",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PartnerShowRailItem_show",
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
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
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
      "kind": "ScalarField",
      "name": "endAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "coverImage",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "images",
      "plural": true,
      "selections": (v0/*: any*/),
      "storageKey": null
    }
  ],
  "type": "Show",
  "abstractKey": null
};
})();
(node as any).hash = '54b5a51d6b04d0248ff1995a6fb3e0b4';
export default node;
