/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArticleCard_article = {
    readonly internalID: string;
    readonly author: {
        readonly name: string | null;
    } | null;
    readonly href: string | null;
    readonly thumbnailImage: {
        readonly url: string | null;
    } | null;
    readonly thumbnailTitle: string | null;
    readonly vertical: string | null;
    readonly " $refType": "ArticleCard_article";
};
export type ArticleCard_article$data = ArticleCard_article;
export type ArticleCard_article$key = {
    readonly " $data"?: ArticleCard_article$data;
    readonly " $fragmentRefs": FragmentRefs<"ArticleCard_article">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArticleCard_article",
  "selections": [
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
      "concreteType": "Author",
      "kind": "LinkedField",
      "name": "author",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "href",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "thumbnailImage",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "large"
            }
          ],
          "kind": "ScalarField",
          "name": "url",
          "storageKey": "url(version:\"large\")"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "thumbnailTitle",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "vertical",
      "storageKey": null
    }
  ],
  "type": "Article",
  "abstractKey": null
};
(node as any).hash = '869d7b383440ec26bbe5745ef4e1b751';
export default node;
