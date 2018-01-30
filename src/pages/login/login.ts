import { FirebaseAuthProvider } from '../../providers/firebase-auth/firebase-auth';
import { AllRecipesPage } from './../all-recipes/all-recipes';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, LoadingController, ToastController} from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import { SignupPage } from '../signup/signup';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';


@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: UserOptions = { email: '', password: '' };
  submitted = false;

  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public firebaseDb: FirebaseDbProvider, public firebaseAuth:FirebaseAuthProvider, public navCtrl: NavController, public userData: UserData) { }

  onLogin(form: NgForm) {
    let loader = this.loadingCtrl.create({
      content: "Logging in..."
    });
    loader.present();
    this.submitted = true;

    if (form.valid) {
      this.userData.login(this.login.email);
      this.firebaseAuth.loginUser(this.login.email, this.login.password).then(
        user => {
          this.userData.storeUid(user.uid);
          this.userData.setUsername(user)
          this.firebaseDb.getUser(user.uid).then(
          (data: any) => {
            const user = data.val();
            this.userData.storeUserData(user);
            this.userData.setUsername(user.username);
            this.navCtrl.setRoot(AllRecipesPage);
            loader.dismiss();
          });
        }, err => {
          console.log('Could not get userData ', err);
          let toast = this.toastCtrl.create({
            message: err.message,
            duration: 3000
          });
          toast.present();
      });
    } else {
      loader.dismiss();
      let toast = this.toastCtrl.create({
        message: 'Invalid Credentials',
        duration: 3000
      });
      toast.present();
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }
}
