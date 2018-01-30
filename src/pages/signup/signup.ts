import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, LoadingController, ToastController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { AllRecipesPage } from '../all-recipes/all-recipes';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { FirebaseAuthProvider } from '../../providers/firebase-auth/firebase-auth';


@Component({
  selector: 'page-user',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: any = { username: '', email: '', password: '' };
  confirmPassword: string = 'a';
  submitted = false;

  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public firebaseDb: FirebaseDbProvider, public firebaseAuth:FirebaseAuthProvider, public navCtrl: NavController, public userData: UserData) {}

  onSignup(form: NgForm) {
    let loader = this.loadingCtrl.create({
      content: "Logging in..."
    });
    loader.present();
    this.submitted = true;
    if (form.valid) {
      this.userData.signup(this.signup.username);
      this.firebaseAuth.registerUser(this.signup.email, this.signup.password).then(
        data => {
          console.log('Authenticated by firebase' + data);
          this.navCtrl.setRoot(AllRecipesPage);
          this.userData.storeUid(data.uid);
          this.firebaseDb.addUserData(data.uid, this.signup).then(
            data => {
              console.log('Submitted to firebase' + data);
              this.userData.storeUserData(this.signup);
              this.userData.setUsername(this.signup.username);
              this.navCtrl.push(AllRecipesPage);
              loader.dismiss();
            }, err => {
              console.log('An error occurred' + err);
              loader.dismiss();
              let toast = this.toastCtrl.create({
                message: err.message,
                duration: 3000
              });
              toast.present();
            }
          );
        }, err => {
          console.log('An error occurred' + err);
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: err.message,
            duration: 3000
          });
          toast.present();
        }
      );
    } else {
      loader.dismiss();
      let toast = this.toastCtrl.create({
        message: 'Invalid Credentials',
        duration: 3000
      });
      toast.present();
    }
  }
}
