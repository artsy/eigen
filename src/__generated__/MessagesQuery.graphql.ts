/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Messages_conversation$ref } from "./Messages_conversation.graphql";
export type MessagesQueryVariables = {
    readonly conversationID: string;
    readonly count: number;
    readonly after?: string | null;
};
export type MessagesQueryResponse = {
    readonly me: ({
        readonly conversation: ({
            readonly " $fragmentRefs": Messages_conversation$ref;
        }) | null;
    }) | null;
};
export type MessagesQuery = {
    readonly response: MessagesQueryResponse;
    readonly variables: MessagesQueryVariables;
};



/*
query MessagesQuery(
  $conversationID: String!
  $count: Int!
  $after: String
) {
  me {
    conversation(id: $conversationID) {
      ...Messages_conversation_2QE1um
      __id: id
    }
    __id: id
  }
}

fragment Messages_conversation_2QE1um on Conversation {
  id
  internalID
  from {
    name
    email
    initials
  }
  to {
    name
    initials
  }
  initial_message
  messages(first: $count, after: $after, sort: DESC) {
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        impulse_id
        is_from_user
        body
        attachments {
          internalID
        }
        ...Message_message
        __id: id
        __typename
      }
    }
  }
  items {
    artwork: item {
      __typename
      ... on Artwork {
        href
        ...ArtworkPreview_artwork
      }
      ... on Node {
        __id: id
      }
    }
    show: item {
      __typename
      ... on Show {
        href
        ...ShowPreview_show
      }
      ... on Node {
        __id: id
      }
    }
  }
  __id: id
}

fragment Message_message on Message {
  body
  created_at
  is_from_user
  from {
    name
    email
  }
  invoice {
    payment_url
    ...InvoicePreview_invoice
    __id: id
  }
  attachments {
    internalID
    content_type
    download_url
    file_name
    ...ImagePreview_attachment
    ...PDFPreview_attachment
  }
  __id: id
}

fragment ArtworkPreview_artwork on Artwork {
  gravityID
  internalID
  title
  artist_names
  date
  image {
    url
  }
  __id: id
}

fragment ShowPreview_show on Show {
  gravityID
  internalID
  name
  cover_image {
    url
  }
  fair {
    name
    __id: id
  }
  partner {
    __typename
    ... on Partner {
      name
    }
    ... on Node {
      __id: id
    }
    ... on ExternalPartner {
      __id: id
    }
  }
  __id: id
}

fragment InvoicePreview_invoice on Invoice {
  payment_url
  state
  total
  lewitt_invoice_id
  __id: id
}

fragment ImagePreview_attachment on Attachment {
  download_url
  ...AttachmentPreview_attachment
}

fragment PDFPreview_attachment on Attachment {
  file_name
  ...AttachmentPreview_attachment
}

fragment AttachmentPreview_attachment on Attachment {
  internalID
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "conversationID",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "after",
    "type": "String",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "conversationID",
    "type": "String!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "email",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "initials",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v11 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "MessagesQuery",
  "id": null,
  "text": "query MessagesQuery(\n  $conversationID: String!\n  $count: Int!\n  $after: String\n) {\n  me {\n    conversation(id: $conversationID) {\n      ...Messages_conversation_2QE1um\n      __id: id\n    }\n    __id: id\n  }\n}\n\nfragment Messages_conversation_2QE1um on Conversation {\n  id\n  internalID\n  from {\n    name\n    email\n    initials\n  }\n  to {\n    name\n    initials\n  }\n  initial_message\n  messages(first: $count, after: $after, sort: DESC) {\n    pageInfo {\n      startCursor\n      endCursor\n      hasPreviousPage\n      hasNextPage\n    }\n    edges {\n      cursor\n      node {\n        id\n        impulse_id\n        is_from_user\n        body\n        attachments {\n          internalID\n        }\n        ...Message_message\n        __id: id\n        __typename\n      }\n    }\n  }\n  items {\n    artwork: item {\n      __typename\n      ... on Artwork {\n        href\n        ...ArtworkPreview_artwork\n      }\n      ... on Node {\n        __id: id\n      }\n    }\n    show: item {\n      __typename\n      ... on Show {\n        href\n        ...ShowPreview_show\n      }\n      ... on Node {\n        __id: id\n      }\n    }\n  }\n  __id: id\n}\n\nfragment Message_message on Message {\n  body\n  created_at\n  is_from_user\n  from {\n    name\n    email\n  }\n  invoice {\n    payment_url\n    ...InvoicePreview_invoice\n    __id: id\n  }\n  attachments {\n    internalID\n    content_type\n    download_url\n    file_name\n    ...ImagePreview_attachment\n    ...PDFPreview_attachment\n  }\n  __id: id\n}\n\nfragment ArtworkPreview_artwork on Artwork {\n  gravityID\n  internalID\n  title\n  artist_names\n  date\n  image {\n    url\n  }\n  __id: id\n}\n\nfragment ShowPreview_show on Show {\n  gravityID\n  internalID\n  name\n  cover_image {\n    url\n  }\n  fair {\n    name\n    __id: id\n  }\n  partner {\n    __typename\n    ... on Partner {\n      name\n    }\n    ... on Node {\n      __id: id\n    }\n    ... on ExternalPartner {\n      __id: id\n    }\n  }\n  __id: id\n}\n\nfragment InvoicePreview_invoice on Invoice {\n  payment_url\n  state\n  total\n  lewitt_invoice_id\n  __id: id\n}\n\nfragment ImagePreview_attachment on Attachment {\n  download_url\n  ...AttachmentPreview_attachment\n}\n\nfragment PDFPreview_attachment on Attachment {\n  file_name\n  ...AttachmentPreview_attachment\n}\n\nfragment AttachmentPreview_attachment on Attachment {\n  internalID\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "MessagesQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "conversation",
            "storageKey": null,
            "args": v1,
            "concreteType": "Conversation",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "Messages_conversation",
                "args": [
                  {
                    "kind": "Variable",
                    "name": "after",
                    "variableName": "after",
                    "type": null
                  },
                  {
                    "kind": "Variable",
                    "name": "count",
                    "variableName": "count",
                    "type": null
                  }
                ]
              },
              v2
            ]
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MessagesQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "conversation",
            "storageKey": null,
            "args": v1,
            "concreteType": "Conversation",
            "plural": false,
            "selections": [
              v3,
              v4,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "from",
                "storageKey": null,
                "args": null,
                "concreteType": "ConversationInitiator",
                "plural": false,
                "selections": [
                  v5,
                  v6,
                  v7
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "to",
                "storageKey": null,
                "args": null,
                "concreteType": "ConversationResponder",
                "plural": false,
                "selections": [
                  v5,
                  v7
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "initial_message",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "messages",
                "storageKey": null,
                "args": [
                  {
                    "kind": "Variable",
                    "name": "after",
                    "variableName": "after",
                    "type": "String"
                  },
                  {
                    "kind": "Variable",
                    "name": "first",
                    "variableName": "count",
                    "type": "Int"
                  },
                  {
                    "kind": "Literal",
                    "name": "sort",
                    "value": "DESC",
                    "type": "sort"
                  }
                ],
                "concreteType": "MessageConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "pageInfo",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "startCursor",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "endCursor",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "hasPreviousPage",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "hasNextPage",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "MessageEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "cursor",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Message",
                        "plural": false,
                        "selections": [
                          v3,
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "impulse_id",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_from_user",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "body",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "attachments",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Attachment",
                            "plural": true,
                            "selections": [
                              v4,
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "content_type",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "download_url",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "file_name",
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "created_at",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "from",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "MessageInitiator",
                            "plural": false,
                            "selections": [
                              v5,
                              v6
                            ]
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "invoice",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Invoice",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "payment_url",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "state",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "total",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "lewitt_invoice_id",
                                "args": null,
                                "storageKey": null
                              },
                              v2
                            ]
                          },
                          v2,
                          v8
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": null,
                "name": "messages",
                "args": [
                  {
                    "kind": "Variable",
                    "name": "after",
                    "variableName": "after",
                    "type": "String"
                  },
                  {
                    "kind": "Variable",
                    "name": "first",
                    "variableName": "count",
                    "type": "Int"
                  },
                  {
                    "kind": "Literal",
                    "name": "sort",
                    "value": "DESC",
                    "type": "sort"
                  }
                ],
                "handle": "connection",
                "key": "Messages_messages",
                "filters": []
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "items",
                "storageKey": null,
                "args": null,
                "concreteType": "ConversationItem",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": "artwork",
                    "name": "item",
                    "storageKey": null,
                    "args": null,
                    "concreteType": null,
                    "plural": false,
                    "selections": [
                      v8,
                      v2,
                      {
                        "kind": "InlineFragment",
                        "type": "Artwork",
                        "selections": [
                          v9,
                          v10,
                          v4,
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
                            "name": "artist_names",
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
                            "name": "image",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": v11
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": "show",
                    "name": "item",
                    "storageKey": null,
                    "args": null,
                    "concreteType": null,
                    "plural": false,
                    "selections": [
                      v8,
                      v2,
                      {
                        "kind": "InlineFragment",
                        "type": "Show",
                        "selections": [
                          v9,
                          v10,
                          v4,
                          v5,
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "cover_image",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": v11
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "fair",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Fair",
                            "plural": false,
                            "selections": [
                              v5,
                              v2
                            ]
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
                              v8,
                              v2,
                              {
                                "kind": "InlineFragment",
                                "type": "Partner",
                                "selections": [
                                  v5
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              v2
            ]
          },
          v2
        ]
      }
    ]
  }
};
})();
(node as any).hash = '8a4e8692f76af568a4c8b73c6306c1c0';
export default node;
