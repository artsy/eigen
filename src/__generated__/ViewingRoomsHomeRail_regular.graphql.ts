/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomsHomeRail_regular = {
    readonly viewingRooms: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly internalID: string;
                readonly title: string;
                readonly slug: string;
                readonly heroImage: {
                    readonly imageURLs: {
                        readonly normalized: string | null;
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
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ViewingRoomsHomeRail_regular";
};
export type ViewingRoomsHomeRail_regular$data = ViewingRoomsHomeRail_regular;
export type ViewingRoomsHomeRail_regular$key = {
    readonly " $data"?: ViewingRoomsHomeRail_regular$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsHomeRail_regular">;
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
  "name": "ViewingRoomsHomeRail_regular",
  "type": "Query",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "viewingRooms",
      "storageKey": "viewingRooms(first:10)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        }
      ],
      "concreteType": "ViewingRoomConnection",
      "plural": false,
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
                  "kind": "LinkedField",
                  "alias": "heroImage",
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
                          "alias": null,
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
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'fcdb293ba50bd8b485b8aa45f96e8bb7';
export default node;
