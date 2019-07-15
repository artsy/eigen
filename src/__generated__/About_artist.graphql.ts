/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { Articles_articles$ref } from "./Articles_articles.graphql";
import { Biography_artist$ref } from "./Biography_artist.graphql";
import { RelatedArtists_artists$ref } from "./RelatedArtists_artists.graphql";
declare const _About_artist$ref: unique symbol;
export type About_artist$ref = typeof _About_artist$ref;
export type About_artist = {
    readonly has_metadata: boolean | null;
    readonly is_display_auction_link: boolean | null;
    readonly slug: string;
    readonly related_artists: ReadonlyArray<{
        readonly " $fragmentRefs": RelatedArtists_artists$ref;
    } | null> | null;
    readonly articles: ReadonlyArray<{
        readonly " $fragmentRefs": Articles_articles$ref;
    } | null> | null;
    readonly " $fragmentRefs": Biography_artist$ref;
    readonly " $refType": About_artist$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "About_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "has_metadata",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_display_auction_link",
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
      "alias": "related_artists",
      "name": "artists",
      "storageKey": "artists(size:16)",
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 16
        }
      ],
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "RelatedArtists_artists",
          "args": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "articles",
      "storageKey": null,
      "args": null,
      "concreteType": "Article",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "Articles_articles",
          "args": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "Biography_artist",
      "args": null
    }
  ]
};
(node as any).hash = '7c149d5a726bed23eddb2cdcab285732';
export default node;
