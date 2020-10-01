/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleListItem_sale = {
    readonly name: string | null;
    readonly href: string | null;
    readonly liveURLIfOpen: string | null;
    readonly liveStartAt: string | null;
    readonly displayTimelyAt: string | null;
    readonly coverImage: {
        readonly url: string | null;
    } | null;
    readonly " $refType": "SaleListItem_sale";
};
export type SaleListItem_sale$data = SaleListItem_sale;
export type SaleListItem_sale$key = {
    readonly " $data"?: SaleListItem_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleListItem_sale">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SaleListItem_sale",
  "selections": [
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
      "name": "href",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "liveURLIfOpen",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "liveStartAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "displayTimelyAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "coverImage",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "large"
            }
          ],
          "kind": "ScalarField",
          "name": "url",
          "storageKey": "url(version:\"large\")"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Sale",
  "abstractKey": null
};
(node as any).hash = '05316e5bbded808509ab908b676ae8fe';
export default node;
