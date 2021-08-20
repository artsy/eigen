/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LotStatusListItem_sale = {
    readonly internalID: string;
    readonly registrationStatus: {
        readonly qualifiedForBidding: boolean | null;
    } | null;
    readonly liveStartAt: string | null;
    readonly endAt: string | null;
    readonly status: string | null;
    readonly isClosed: boolean | null;
    readonly " $refType": "LotStatusListItem_sale";
};
export type LotStatusListItem_sale$data = LotStatusListItem_sale;
export type LotStatusListItem_sale$key = {
    readonly " $data"?: LotStatusListItem_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"LotStatusListItem_sale">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LotStatusListItem_sale",
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
      "concreteType": "Bidder",
      "kind": "LinkedField",
      "name": "registrationStatus",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "qualifiedForBidding",
          "storageKey": null
        }
      ],
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
      "name": "endAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isClosed",
      "storageKey": null
    }
  ],
  "type": "Sale",
  "abstractKey": null
};
(node as any).hash = 'd375674f2a28285e7db06a3dd541192a';
export default node;
