// @flow
import { plural } from "pluralize";

type ConnectionFields = {
  [key: string]: any,
};

export function createFields(prefix: string): ConnectionFields {
  const connectionFieldName = plural(prefix);
  const countFieldName = `${prefix}Count`;
  return {
    [connectionFieldName]: {},
    [countFieldName]: {},
  };
}
