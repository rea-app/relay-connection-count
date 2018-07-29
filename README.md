# relay-connection-count

This helper generates a `count` field in your GraphQL schema next to a Relay connection.

## Installation

```
npm install --save relay-connection-count

# or

yarn add relay-connection-count
```

**Warning:** This package expects `graphql` and `graphql-relay` to be already installed.

## Usage

```javascript
import { createFields } from "relay-connection-count";

// ...

const userType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: globalIdField("User", u => u._id),
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    ...createFields({
      prefix: "project",
      connectionType: userConnection,
      resolveConnection: u => u.projects,
    }),
  }),
});
```

Tis should give a schema looking like:

```graphql
type User {
  id: ID!
  name: String!
  projects(
    after: String
    first: Int
    before: String
    last: Int
  ): BatchConnection
  projectCount: Int!
}
```

## API

The parameter of the `createFields` function is an object containing following keys:

- `prefix: string`: the prefix used to generate field name. For example, prefix `project` will output `projects` and `projectCount` fields.
- `connectionType: GraphQLObjectType`: the type of the connection (most likely generated with `connectionDefinitions`).
- `resolveConnection: Function`: takes the same parameters as a usual `resolve` function, and should return either an **array of elements** or a **promised array**.
- `extraArgs?: ?{[string]: { type : GraphQLInputType }}`: a usual graphql arguments' definition.
