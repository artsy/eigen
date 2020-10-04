/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleArtworkList_connection = {
    readonly edges: ReadonlyArray<{
        readonly cursor: string;
        readonly node: {
            readonly id: string;
            readonly " $fragmentRefs": FragmentRefs<"SaleArtworkListItem_saleArtwork">;
        } | null;
    } | null> | null;
    readonly " $refType": "SaleArtworkList_connection";
};
export type SaleArtworkList_connection$data = SaleArtworkList_connection;
export type SaleArtworkList_connection$key = {
    readonly " $data"?: SaleArtworkList_connection$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleArtworkList_connection">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SaleArtworkList_connection",
  "type": "SaleArtworkConnection",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "edges",
      "storageKey": null,
      "args": null,
      "concreteType": "SaleArtworkEdge",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "cursor",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "node",
          "storageKey": null,
          "args": null,
          "concreteType": "SaleArtwork",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "id",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "FragmentSpread",
              "name": "SaleArtworkListItem_saleArtwork",
              "args": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = 'f40f10270a73a17871dd068d26b43a56';
export default node;
