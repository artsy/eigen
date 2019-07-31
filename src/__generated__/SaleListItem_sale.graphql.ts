/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _SaleListItem_sale$ref: unique symbol;
export type SaleListItem_sale$ref = typeof _SaleListItem_sale$ref;
export type SaleListItem_sale = {
    readonly slug: string;
    readonly name: string | null;
    readonly href: string | null;
    readonly is_open: boolean | null;
    readonly is_live_open: boolean | null;
    readonly live_url_if_open: string | null;
    readonly start_at: string | null;
    readonly end_at: string | null;
    readonly registration_ends_at: string | null;
    readonly live_start_at: string | null;
    readonly display_timely_at: string | null;
    readonly cover_image: {
        readonly url: string | null;
        readonly aspect_ratio: number;
    } | null;
    readonly " $refType": SaleListItem_sale$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SaleListItem_sale",
  "type": "Sale",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "href",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "is_open",
      "name": "isOpen",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "is_live_open",
      "name": "isLiveOpen",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "live_url_if_open",
      "name": "liveURLIfOpen",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "start_at",
      "name": "startAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "end_at",
      "name": "endAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "registration_ends_at",
      "name": "registrationEndsAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "live_start_at",
      "name": "liveStartAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "display_timely_at",
      "name": "displayTimelyAt",
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
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "large"
            }
          ],
          "storageKey": "url(version:\"large\")"
        },
        {
          "kind": "ScalarField",
          "alias": "aspect_ratio",
          "name": "aspectRatio",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = 'e069a0350693c90a17cbde4410b0c918';
export default node;
