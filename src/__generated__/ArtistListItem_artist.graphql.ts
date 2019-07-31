/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ArtistListItem_artist$ref: unique symbol;
export type ArtistListItem_artist$ref = typeof _ArtistListItem_artist$ref;
export type ArtistListItem_artist = {
    readonly id: string;
    readonly internalID: string;
    readonly slug: string;
    readonly name: string | null;
    readonly initials: string | null;
    readonly href: string | null;
    readonly is_followed: boolean | null;
    readonly nationality: string | null;
    readonly birthday: string | null;
    readonly deathday: string | null;
    readonly image: {
        readonly url: string | null;
    } | null;
    readonly " $refType": ArtistListItem_artist$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtistListItem_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
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
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "initials",
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
      "alias": "is_followed",
      "name": "isFollowed",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "nationality",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "birthday",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "deathday",
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
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = 'e55e8c71403aeda8f430c4dcbf5db4bd';
export default node;
