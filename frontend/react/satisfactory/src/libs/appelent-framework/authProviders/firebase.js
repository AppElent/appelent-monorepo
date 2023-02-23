import { FirebaseApp } from "@firebase/app";
import { AuthProvider } from "@pankod/refine-core";
import {
  Auth,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  getIdTokenResult,
  ParsedToken,
  RecaptchaParameters,
  RecaptchaVerifier,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword as updatePasswordFirebase,
  updateProfile,
} from "firebase/auth";

export class FirebaseAuth {
  auth;

  constructor(authActions, firebaseApp, auth) {
    this.auth = auth || getAuth(firebaseApp);
    this.auth.useDeviceLanguage();

    this.getAuthProvider = this.getAuthProvider.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.onUpdateUserData = this.onUpdateUserData.bind(this);
    this.getUserIdentity = this.getUserIdentity.bind(this);
    this.handleCheckAuth = this.handleCheckAuth.bind(this);
    this.createRecaptcha = this.createRecaptcha.bind(this);
    this.getPermissions = this.getPermissions.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  async handleLogOut() {
    await signOut(this.auth);
    await this.authActions?.onLogout?.(this.auth);
  }

  async handleRegister(args) {
    try {
      const { email, password, displayName } = args;

      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      if (userCredential.user) {
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
        this.authActions?.onRegister?.(userCredential.user);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async handleLogIn({ email, password, remember }) {
    try {
      if (this.auth) {
        await this.auth.setPersistence(
          remember ? browserLocalPersistence : browserSessionPersistence
        );

        const userCredential = await signInWithEmailAndPassword(
          this.auth,
          email,
          password
        );
        const userToken = await userCredential?.user?.getIdToken?.();
        if (userToken) {
          this.authActions?.onLogin?.(userCredential.user);
        } else {
          return Promise.reject();
        }
      } else {
        return Promise.reject();
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  handleResetPassword(email) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async updatePassword(password) {
    console.log(password);
    try {
      const result = await updatePasswordFirebase(
        this.auth.currentUser,
        password.password
      );
      //return Promise.reject(args);
      console.log(result);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async onUpdateUserData(args) {
    try {
      if (this.auth?.currentUser) {
        const { displayName, email, password } = args;
        if (password) {
          await updatePassword(this.auth.currentUser, password);
        }

        if (email && this.auth.currentUser.email !== email) {
          await updateEmail(this.auth.currentUser, email);
        }

        if (displayName && this.auth.currentUser.displayName !== displayName) {
          await updateProfile(this.auth.currentUser, {
            displayName: displayName,
          });
        }
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getUserIdentity() {
    const user = this.auth?.currentUser;
    return {
      ...this.auth.currentUser,
      email: user?.email || "",
      name: user?.displayName || "",
    };
  }

  getFirebaseUser() {
    return (
      new Promise() <
      FirebaseUser >
      ((resolve, reject) => {
        const unsubscribe = this.auth?.onAuthStateChanged((user) => {
          unsubscribe();
          resolve(user);
        }, reject);
      })
    );
  }

  async handleCheckAuth() {
    if (await this.getFirebaseUser()) {
      return Promise.resolve();
    } else {
      return Promise.reject("User is not found");
    }
  }

  async getPermissions() {
    if (this.auth?.currentUser) {
      const idTokenResult = await getIdTokenResult(this.auth.currentUser);
      return idTokenResult?.claims;
    } else {
      return Promise.reject("User is not found");
    }
  }

  createRecaptcha(containerOrId, parameters) {
    return new RecaptchaVerifier(containerOrId, parameters, this.auth);
  }

  getAuthProvider() {
    return {
      login: this.handleLogIn,
      logout: this.handleLogOut,
      checkAuth: this.handleCheckAuth,
      checkError: () => Promise.resolve(),
      getPermissions: this.getPermissions,
      getUserIdentity: this.getUserIdentity,
      updatePassword: this.updatePassword,
    };
  }
}
