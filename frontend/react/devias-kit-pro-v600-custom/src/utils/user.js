import { updateProfile } from "firebase/auth";

export const updateUser = (user) => async (userObj) =>
  updateProfile(user, userObj);

export const deleteUser = (id) => () => {};
