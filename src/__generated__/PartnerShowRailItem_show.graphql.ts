/* tslint:disable */
/* eslint-disable */

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
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "PartnerShowRailItem_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
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
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "exhibitionPeriod",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "endAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "coverImage",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": (v0/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "images",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": true,
      "selections": (v0/*: any*/)
    }
  ]
};
})();
(node as any).hash = '54b5a51d6b04d0248ff1995a6fb3e0b4';
export default node;
