/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _GlobalMap_viewer$ref: unique symbol;
export type GlobalMap_viewer$ref = typeof _GlobalMap_viewer$ref;
export type GlobalMap_viewer = {
    readonly city: ({
        readonly name: string | null;
        readonly coordinates: ({
            readonly lat: number | null;
            readonly lng: number | null;
        }) | null;
        readonly shows: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly name: string | null;
                    readonly cover_image: ({
                        readonly url: string | null;
                    }) | null;
                    readonly location: ({
                        readonly coordinates: ({
                            readonly lat: number | null;
                            readonly lng: number | null;
                        }) | null;
                    }) | null;
                    readonly type: string | null;
                    readonly start_at: string | null;
                    readonly end_at: string | null;
                    readonly partner: ({
                        readonly name?: string | null;
                        readonly type?: string | null;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly fairs: ReadonlyArray<({
            readonly id: string;
            readonly name: string | null;
        }) | null> | null;
    }) | null;
    readonly " $refType": GlobalMap_viewer$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "coordinates",
  "storageKey": null,
  "args": null,
  "concreteType": "LatLng",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "lat",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "lng",
      "args": null,
      "storageKey": null
    }
  ]
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "type",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "GlobalMap_viewer",
  "type": "Viewer",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "near",
      "type": "Near!",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "city",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "near",
          "variableName": "near",
          "type": "Near"
        }
      ],
      "concreteType": "City",
      "plural": false,
      "selections": [
        v0,
        v1,
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "shows",
          "storageKey": "shows(discoverable:true,first:50,sort:\"START_AT_ASC\")",
          "args": [
            {
              "kind": "Literal",
              "name": "discoverable",
              "value": true,
              "type": "Boolean"
            },
            {
              "kind": "Literal",
              "name": "first",
              "value": 50,
              "type": "Int"
            },
            {
              "kind": "Literal",
              "name": "sort",
              "value": "START_AT_ASC",
              "type": "PartnerShowSorts"
            }
          ],
          "concreteType": "ShowConnection",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "ShowEdge",
              "plural": true,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "node",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Show",
                  "plural": false,
                  "selections": [
                    v2,
                    v0,
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "cover_image",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "Image",
                      "plural": false,
                      "selections": [
                        {
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "url",
                          "args": null,
                          "storageKey": null
                        }
                      ]
                    },
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "location",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "Location",
                      "plural": false,
                      "selections": [
                        v1,
                        v3
                      ]
                    },
                    v4,
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "start_at",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "end_at",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "partner",
                      "storageKey": null,
                      "args": null,
                      "concreteType": null,
                      "plural": false,
                      "selections": [
                        v3,
                        {
                          "kind": "InlineFragment",
                          "type": "ExternalPartner",
                          "selections": [
                            v0
                          ]
                        },
                        {
                          "kind": "InlineFragment",
                          "type": "Partner",
                          "selections": [
                            v0,
                            v4
                          ]
                        }
                      ]
                    },
                    v3
                  ]
                }
              ]
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "fairs",
          "storageKey": "fairs(size:10)",
          "args": [
            {
              "kind": "Literal",
              "name": "size",
              "value": 10,
              "type": "Int"
            }
          ],
          "concreteType": "Fair",
          "plural": true,
          "selections": [
            v2,
            v0,
            v3
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '9845d1a7e1036d315b6aeadce9cb859d';
export default node;
