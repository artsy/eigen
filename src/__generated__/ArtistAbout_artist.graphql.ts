/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistAbout_artist = {
    readonly hasMetadata: boolean | null;
    readonly internalID: string;
    readonly slug: string;
    readonly notableWorks: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
            } | null;
        } | null> | null;
    } | null;
    readonly iconicCollections: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"ArtistCollectionsRail_collections">;
    } | null> | null;
    readonly related: {
        readonly artists: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly " $fragmentRefs": FragmentRefs<"RelatedArtists_artists">;
                } | null;
            } | null> | null;
        } | null;
    } | null;
    readonly articles: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"Articles_articles">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"Biography_artist" | "ArtistSeriesMoreSeries_artist" | "ArtistNotableWorksRail_artist" | "ArtistCollectionsRail_artist" | "ArtistConsignButton_artist" | "ArtistAboutShows_artist">;
    readonly " $refType": "ArtistAbout_artist";
};
export type ArtistAbout_artist$data = ArtistAbout_artist;
export type ArtistAbout_artist$key = {
    readonly " $data"?: ArtistAbout_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistAbout_artist">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistAbout_artist",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasMetadata",
      "storageKey": null
    },
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
      "alias": "notableWorks",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 3
        },
        {
          "kind": "Literal",
          "name": "input",
          "value": {
            "sort": "-weighted_iconicity"
          }
        }
      ],
      "concreteType": "FilterArtworksConnection",
      "kind": "LinkedField",
      "name": "filterArtworksConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "FilterArtworksEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Artwork",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "filterArtworksConnection(first:3,input:{\"sort\":\"-weighted_iconicity\"})"
    },
    {
      "alias": "iconicCollections",
      "args": [
        {
          "kind": "Literal",
          "name": "isFeaturedArtistContent",
          "value": true
        },
        {
          "kind": "Literal",
          "name": "size",
          "value": 16
        }
      ],
      "concreteType": "MarketingCollection",
      "kind": "LinkedField",
      "name": "marketingCollections",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ArtistCollectionsRail_collections"
        }
      ],
      "storageKey": "marketingCollections(isFeaturedArtistContent:true,size:16)"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ArtistRelatedData",
      "kind": "LinkedField",
      "name": "related",
      "plural": false,
      "selections": [
        {
          "alias": "artists",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 16
            }
          ],
          "concreteType": "ArtistConnection",
          "kind": "LinkedField",
          "name": "artistsConnection",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "ArtistEdge",
              "kind": "LinkedField",
              "name": "edges",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Artist",
                  "kind": "LinkedField",
                  "name": "node",
                  "plural": false,
                  "selections": [
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "RelatedArtists_artists"
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": "artistsConnection(first:16)"
        }
      ],
      "storageKey": null
    },
    {
      "alias": "articles",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        },
        {
          "kind": "Literal",
          "name": "inEditorialFeed",
          "value": true
        }
      ],
      "concreteType": "ArticleConnection",
      "kind": "LinkedField",
      "name": "articlesConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ArticleEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Article",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "Articles_articles"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "articlesConnection(first:10,inEditorialFeed:true)"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Biography_artist"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtistSeriesMoreSeries_artist"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtistNotableWorksRail_artist"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtistCollectionsRail_artist"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtistConsignButton_artist"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtistAboutShows_artist"
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = '6d256142c41f599abfa9db68190c75ad';
export default node;
