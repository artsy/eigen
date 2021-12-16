/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LotStatusListItem_saleArtwork = {
    readonly isWatching: boolean | null;
    readonly lotState: {
        readonly soldStatus: string | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ClosedLotStanding_saleArtwork" | "ActiveLotStanding_saleArtwork" | "WatchedLot_saleArtwork">;
    readonly " $refType": "LotStatusListItem_saleArtwork";
};
export type LotStatusListItem_saleArtwork$data = LotStatusListItem_saleArtwork;
export type LotStatusListItem_saleArtwork$key = {
    readonly " $data"?: LotStatusListItem_saleArtwork$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"LotStatusListItem_saleArtwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LotStatusListItem_saleArtwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isWatching",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "CausalityLotState",
      "kind": "LinkedField",
      "name": "lotState",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "soldStatus",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ClosedLotStanding_saleArtwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ActiveLotStanding_saleArtwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WatchedLot_saleArtwork"
    }
  ],
  "type": "SaleArtwork",
  "abstractKey": null
};
(node as any).hash = '22cc41e754778d14e883967aa6882c57';
export default node;
