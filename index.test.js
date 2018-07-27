// @flow
import { createFields } from "./index";

test("it should correctly name fields", () => {
  const connectionFields = createFields("user");

  expect(Object.keys(connectionFields)).toHaveLength(2);
  expect(connectionFields).toHaveProperty("users");
  expect(connectionFields).toHaveProperty("userCount");
});
