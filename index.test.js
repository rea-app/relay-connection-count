// @flow
import { createFields } from "./index";

test("it should return an array containing two elements", () => {
  const connectionFields = createFields();
  expect(connectionFields).toHaveLength(2);
});
