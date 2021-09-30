/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowsRail_showsConnection = {
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly internalID: string;
            readonly slug: string;
            readonly " $fragmentRefs": FragmentRefs<"ShowCard_show">;
        } | null;
    } | null> | null;
    readonly " $refType": "ShowsRail_showsConnection";
};
export type ShowsRail_showsConnection$data = ShowsRail_showsConnection;
export type ShowsRail_showsConnection$key = {
    readonly " $data"?: ShowsRail_showsConnection$data;
    readonly " $fragmentRefs": FragmentRefs<"ShowsRail_showsConnection">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShowsRail_showsConnection",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ShowEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Show",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
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
              "args": null,
              "kind": "FragmentSpread",
              "name": "ShowCard_show"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ShowConnection",
  "abstractKey": null
};
(node as any).hash = '406fad34899a20a1261869ad3372b1a4';
export default node;
