/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomsListItem_item = {
    readonly internalID: string;
    readonly title: string;
    readonly slug: string;
    readonly image: {
        readonly imageURLs: {
            readonly heroImage: string | null;
        } | null;
    } | null;
    readonly status: string;
    readonly distanceToOpen: string | null;
    readonly distanceToClose: string | null;
    readonly partner: {
        readonly name: string | null;
    } | null;
    readonly artworksConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly image: {
                    readonly square: string | null;
                    readonly regular: string | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ViewingRoomsListItem_item";
};
export type ViewingRoomsListItem_item$data = ViewingRoomsListItem_item;
export type ViewingRoomsListItem_item$key = {
    readonly " $data"?: ViewingRoomsListItem_item$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsListItem_item">;
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
  "name": "ViewingRoomsListItem_item",
  "type": "ViewingRoom",
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
      "kind": "LinkedField",
      "alias": null,
      "name": "image",
      "storageKey": null,
      "args": null,
      "concreteType": "ARImage",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "imageURLs",
          "storageKey": null,
          "args": null,
          "concreteType": "ImageURLs",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": "heroImage",
              "name": "normalized",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
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
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artworksConnection",
      "storageKey": "artworksConnection(first:2)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 2
        }
      ],
      "concreteType": "ArtworkConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtworkEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Artwork",
              "plural": false,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "image",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Image",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": "square",
                      "name": "url",
                      "args": [
                        {
                          "kind": "Literal",
                          "name": "version",
                          "value": "square"
                        }
                      ],
                      "storageKey": "url(version:\"square\")"
                    },
                    {
                      "kind": "ScalarField",
                      "alias": "regular",
                      "name": "url",
                      "args": [
                        {
                          "kind": "Literal",
                          "name": "version",
                          "value": "larger"
                        }
                      ],
                      "storageKey": "url(version:\"larger\")"
                    }
                  ]
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
(node as any).hash = '597017333cf29d498b17bebbf72232e9';
export default node;
