import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";

export const updateUser = (user, updateState) => async (userObj) => {
  await updateProfile(user, userObj);
  if (updateState) {
    await updateState(userObj);
  }
  toast.success("Updated user profile");
};

export const deleteUser = (id) => () => {};
