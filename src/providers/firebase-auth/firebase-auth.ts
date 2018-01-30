import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
/*
  Generated class for the FirebaseAuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseAuthProvider {
  fireAuth: any;
  constructor() {
    const fbConf = {
      apiKey: 'AIzaSyDnkX2i1_fF1_S0APOT5XT3nKGiwzwThyQ',
      authDomain: 'cookbook-2b271.firebaseapp.com',
      databaseURL: 'https://cookbook-2b271.firebaseio.com',
      projectId: 'cookbook-2b271',
      storageBucket: 'cookbook-2b271.appspot.com',
      messagingSenderId: '18016782020'
    };
    firebase.initializeApp(fbConf);
    this.fireAuth = firebase.auth();
  }

  loginUser(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }
  registerUser(email, password): any {
      return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }
  getAccessToken(): any {
    return this.fireAuth.currentUser.getIdToken(true);
  }
  logoutUser() {
    return this.fireAuth.signOut();
  }
  resetPassword(email: string): any {
    return this.fireAuth.sendPasswordResetEmail(email);
  }
}
