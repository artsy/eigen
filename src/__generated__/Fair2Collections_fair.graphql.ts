/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2Collections_fair = {
    readonly marketingCollections: ReadonlyArray<{
        readonly slug: string;
        readonly title: string;
        readonly category: string;
        readonly artworks: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly image: {
                        readonly url: string | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
    } | null>;
    readonly " $refType": "Fair2Collections_fair";
};
export type Fair2Collections_fair$data = Fair2Collections_fair;
export type Fair2Collections_fair$key = {
    readonly " $data"?: Fair2Collections_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2Collections_fair">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Fair2Collections_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "marketingCollections",
      "storageKey": "marketingCollections(size:4)",
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 4
        }
      ],
      "concreteType": "MarketingCollection",
      "plural": true,
      "selections": [
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
          "name": "title",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "category",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": "artworks",
          "name": "artworksConnection",
          "storageKey": "artworksConnection(first:3)",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 3
            }
          ],
          "concreteType": "FilterArtworksConnection",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "FilterArtworksEdge",
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
                          "alias": null,
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
};
(node as any).hash = '4712ef10d0dba7256a903b60973e1fa6';
export default node;
