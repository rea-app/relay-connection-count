// @flow
import { plural } from "pluralize";
import {
  connectionDefinitions,
  connectionArgs,
  connectionFromArray,
  connectionFromPromisedArray,
} from "graphql-relay";
import { GraphQLInt, GraphQLNonNull, type GraphQLObjectType } from "graphql";

type ConnectionFields = {
  [key: string]: any,
};

type Config<T> = {
  prefix: string,
  connectionType: GraphQLObjectType,
  resolveConnection: (...any) => Array<T> | Promise<Array<T>>,
  extraArgs?: ?any,
};

export function createFields<T>(config: Config<T>): ConnectionFields {
  const { prefix, connectionType, resolveConnection, extraArgs } = config;
  const connectionFieldName = plural(prefix);
  const countFieldName = `${prefix}Count`;
  return {
    [connectionFieldName]: {
      type: connectionType,
      args: { ...connectionArgs, ...(extraArgs || {}) },
      resolve: (...params) => {
        const elements = resolveConnection(...params);
        const args = params[1];
        if (elements instanceof Promise) {
          return connectionFromPromisedArray(elements, args);
        } else {
          return connectionFromArray(elements, args);
        }
      },
    },
    [countFieldName]: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: (...params) => {
        const elements = resolveConnection(...params);
        if (elements instanceof Promise) {
          return elements.then(e => e.length);
        } else {
          return elements.length;
        }
      },
    },
  };
}
