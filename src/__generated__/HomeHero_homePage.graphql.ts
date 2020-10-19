/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type HomeHero_homePage = {
    readonly heroUnits: ReadonlyArray<{
        readonly title: string | null;
        readonly subtitle: string | null;
        readonly creditLine: string | null;
        readonly linkText: string | null;
        readonly href: string | null;
        readonly backgroundImageURL: string | null;
    } | null> | null;
    readonly " $refType": "HomeHero_homePage";
};
export type HomeHero_homePage$data = HomeHero_homePage;
export type HomeHero_homePage$key = {
    readonly " $data"?: HomeHero_homePage$data;
    readonly " $fragmentRefs": FragmentRefs<"HomeHero_homePage">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "heroImageVersion"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "HomeHero_homePage",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "platform",
          "value": "MOBILE"
        }
      ],
      "concreteType": "HomePageHeroUnit",
      "kind": "LinkedField",
      "name": "heroUnits",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "title",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "subtitle",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "creditLine",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "linkText",
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
          "args": [
            {
              "kind": "Variable",
              "name": "version",
              "variableName": "heroImageVersion"
            }
          ],
          "kind": "ScalarField",
          "name": "backgroundImageURL",
          "storageKey": null
        }
      ],
      "storageKey": "heroUnits(platform:\"MOBILE\")"
    }
  ],
  "type": "HomePage",
  "abstractKey": null
};
(node as any).hash = '8ac1fd8f53214f528b9b93e874a60f65';
export default node;
