// @flow
import { plural } from "pluralize";
import {
  connectionDefinitions,
  connectionArgs,
  connectionFromArray,
  connectionFromPromisedArray,
} from "graphql-relay";
import { GraphQLInt, GraphQLNonNull } from "graphql";

type ConnectionFields = {
  [key: string]: any,
};

type Config<T, Y> = {
  prefix: string,
  connectionType: T,
  resolveConnection: (...any) => Array<Y> | Promise<Array<Y>>,
  extraArgs?: ?any,
};

export function createFields<T, Y>(config: Config<T, Y>): ConnectionFields {
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
