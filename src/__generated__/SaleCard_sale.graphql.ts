/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleCard_sale = {
    readonly href: string | null;
    readonly name: string | null;
    readonly liveStartAt: string | null;
    readonly endAt: string | null;
    readonly displayTimelyAt: string | null;
    readonly coverImage: {
        readonly url: string | null;
    } | null;
    readonly partner: {
        readonly name: string | null;
    } | null;
    readonly " $refType": "SaleCard_sale";
};
export type SaleCard_sale$data = SaleCard_sale;
export type SaleCard_sale$key = {
    readonly " $data"?: SaleCard_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleCard_sale">;
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
  "name": "SaleCard_sale",
  "type": "Sale",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "href",
      "args": null,
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "liveStartAt",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "displayTimelyAt",
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
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": "Partner",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ]
    }
  ]
};
})();
(node as any).hash = '3187ddee85492956a3a4e453a92d5894';
export default node;
