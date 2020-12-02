/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleActiveBids_me = {
    readonly lotStandings: ReadonlyArray<{
        readonly saleArtwork: {
            readonly slug: string;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"SaleActiveBidItem_lotStanding">;
    } | null> | null;
    readonly " $refType": "SaleActiveBids_me";
};
export type SaleActiveBids_me$data = SaleActiveBids_me;
export type SaleActiveBids_me$key = {
    readonly " $data"?: SaleActiveBids_me$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleActiveBids_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "saleID"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "SaleActiveBids_me",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "saleID",
          "variableName": "saleID"
        }
      ],
      "concreteType": "LotStanding",
      "kind": "LinkedField",
      "name": "lotStandings",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "SaleArtwork",
          "kind": "LinkedField",
          "name": "saleArtwork",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "slug",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "SaleActiveBidItem_lotStanding"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'b9221180bf36bae1e8dfc709651af79e';
export default node;
