import { UserStoreModel } from "./user-list"

test("can be created", () => {
  const instance = UserStoreModel.create({})

  expect(instance).toBeTruthy()
})
