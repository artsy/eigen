/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomsListFeatured_featured = {
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly internalID: string;
            readonly title: string;
            readonly slug: string;
            readonly heroImageURL: string | null;
            readonly status: string;
            readonly distanceToOpen: string | null;
            readonly distanceToClose: string | null;
            readonly partner: {
                readonly name: string | null;
            } | null;
        } | null;
    } | null> | null;
    readonly " $refType": "ViewingRoomsListFeatured_featured";
};
export type ViewingRoomsListFeatured_featured$data = ViewingRoomsListFeatured_featured;
export type ViewingRoomsListFeatured_featured$key = {
    readonly " $data"?: ViewingRoomsListFeatured_featured$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsListFeatured_featured">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "short",
    "value": true
  }
];
return {
  "kind": "Fragment",
  "name": "ViewingRoomsListFeatured_featured",
  "type": "ViewingRoomConnection",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "edges",
      "storageKey": null,
      "args": null,
      "concreteType": "ViewingRoomEdge",
      "plural": true,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "node",
          "storageKey": null,
          "args": null,
          "concreteType": "ViewingRoom",
          "plural": false,
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
              "name": "title",
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
              "name": "heroImageURL",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "status",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "distanceToOpen",
              "args": (v0/*: any*/),
              "storageKey": "distanceToOpen(short:true)"
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "distanceToClose",
              "args": (v0/*: any*/),
              "storageKey": "distanceToClose(short:true)"
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
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "name",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '2c6d3b4d006b8ebe1e53ee0fae209ff4';
export default node;
