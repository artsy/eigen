/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworksInSeriesRail_artwork = {
    readonly artistSeriesConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly slug: string;
                readonly artworksConnection: {
                    readonly edges: ReadonlyArray<{
                        readonly node: {
                            readonly slug: string;
                            readonly internalID: string;
                            readonly href: string | null;
                            readonly artistNames: string | null;
                            readonly image: {
                                readonly imageURL: string | null;
                                readonly aspectRatio: number;
                            } | null;
                            readonly saleMessage: string | null;
                            readonly title: string | null;
                            readonly date: string | null;
                            readonly partner: {
                                readonly name: string | null;
                            } | null;
                        } | null;
                    } | null> | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ArtworksInSeriesRail_artwork";
};
export type ArtworksInSeriesRail_artwork$data = ArtworksInSeriesRail_artwork;
export type ArtworksInSeriesRail_artwork$key = {
    readonly " $data"?: ArtworksInSeriesRail_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworksInSeriesRail_artwork">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ArtworksInSeriesRail_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artistSeriesConnection",
      "storageKey": "artistSeriesConnection(first:1)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        }
      ],
      "concreteType": "ArtistSeriesConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtistSeriesEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "ArtistSeries",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "artworksConnection",
                  "storageKey": "artworksConnection(first:20)",
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "first",
                      "value": 20
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
                            (v0/*: any*/),
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
                              "name": "href",
                              "args": null,
                              "storageKey": null
                            },
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "name": "artistNames",
                              "args": null,
                              "storageKey": null
                            },
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
                                  "name": "imageURL",
                                  "args": null,
                                  "storageKey": null
                                },
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "name": "aspectRatio",
                                  "args": null,
                                  "storageKey": null
                                }
                              ]
                            },
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "name": "saleMessage",
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
                              "name": "date",
                              "args": null,
                              "storageKey": null
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
(node as any).hash = 'ec9c70a0a16971280525c46f787ea7ea';
export default node;
