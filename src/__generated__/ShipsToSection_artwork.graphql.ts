/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShipsToSection_artwork = {
    readonly lineItems: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly artwork: {
                    readonly image: {
                        readonly resized: {
                            readonly url: string;
                        } | null;
                    } | null;
                    readonly title: string | null;
                    readonly artist_names: string | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ShipsToSection_artwork";
};
export type ShipsToSection_artwork$data = ShipsToSection_artwork;
export type ShipsToSection_artwork$key = {
    readonly " $data"?: ShipsToSection_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ShipsToSection_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShipsToSection_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "CommerceLineItemConnection",
      "kind": "LinkedField",
      "name": "lineItems",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "CommerceLineItemEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "CommerceLineItem",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Artwork",
                  "kind": "LinkedField",
                  "name": "artwork",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Image",
                      "kind": "LinkedField",
                      "name": "image",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": [
                            {
                              "kind": "Literal",
                              "name": "width",
                              "value": 55
                            }
                          ],
                          "concreteType": "ResizedImageUrl",
                          "kind": "LinkedField",
                          "name": "resized",
                          "plural": false,
                          "selections": [
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "url",
                              "storageKey": null
                            }
                          ],
                          "storageKey": "resized(width:55)"
                        }
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "title",
                      "storageKey": null
                    },
                    {
                      "alias": "artist_names",
                      "args": null,
                      "kind": "ScalarField",
                      "name": "artistNames",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "CommerceOrder",
  "abstractKey": "__isCommerceOrder"
};
(node as any).hash = '556b5bade8adf9bfe32a078e17af1655';
export default node;
