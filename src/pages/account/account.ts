import { Camera, CameraOptions} from '@ionic-native/camera';
import { Component } from '@angular/core';

import { AlertController, NavController, ToastController, ActionSheetController, LoadingController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';
import { FirebaseAuthProvider } from '../../providers/firebase-auth/firebase-auth';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { MyRecipesPage } from '../my-recipes/my-recipes';
import { AllRecipesPage } from '../all-recipes/all-recipes';
import { FavoritesPage } from '../favorites/favorites';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  newPassword: string;
  username: string;
  profilePhoto: string;
  constructor(public loadingCtrl: LoadingController, private camera: Camera, public actionSheetCtrl: ActionSheetController,public toastCtrl: ToastController, public firebaseDb: FirebaseDbProvider, public firebaseAuth:FirebaseAuthProvider, public alertCtrl: AlertController, public nav: NavController, public userData: UserData) {

  }

  ngAfterViewInit() {
    this.profilePhoto = 'assets/avatar.png';
    if (this.userData.getProfilephoto()) {
      this.profilePhoto = this.userData.getProfilephoto();
    }
    this.getUsername();
  }
  takeProfilephoto() {
    
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 300,
      targetHeight: 300,
      allowEdit: true,
      sourceType: 1
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let loader = this.loadingCtrl.create({
      content: "uploading photo ..."
    });
    loader.present();
     const base64Image = 'data:image/jpeg;base64,' + imageData;
     this.profilePhoto = base64Image;
     loader.dismiss();
     this.userData.setProfilephoto(base64Image);
     this.firebaseDb.updateProfilePhoto(this.userData.getUid(), this.profilePhoto);
     let toast = this.toastCtrl.create({
      message: 'Photo uploaded successfully',
      duration: 3000
    });
    toast.present();
    }, (err) => {
     console.log('An error occurred', err);
     let toast = this.toastCtrl.create({
      message: 'Error uploading photo',
      duration: 3000
    });
    toast.present();
    });
  }
  addProfilePhoto() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload Recipe Image',
      buttons: [
        {
          text: 'Select from gallery',
          role: 'destructive',
          handler: () => {
            this.selectProfilephoto()
          }
        },{
          text: 'Use Camera',
          handler: () => {
            this.takeProfilephoto();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  selectProfilephoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 300,
      targetHeight: 300,
      sourceType: 0
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let loader = this.loadingCtrl.create({
      content: "uploading photo ..."
    });
    loader.present();
     const base64Image = 'data:image/jpeg;base64,' + imageData;
     this.profilePhoto = base64Image;
     loader.dismiss();
     this.userData.setProfilephoto(base64Image);
     this.firebaseDb.updateProfilePhoto(this.userData.getUid(), this.profilePhoto);
     let toast = this.toastCtrl.create({
      message: 'Photo uploaded successfully',
      duration: 3000
    });
    toast.present();
    }, (err) => {
     console.log('An error occurred', err);
     let toast = this.toastCtrl.create({
      message: 'Error uploading photo',
      duration: 3000
    });
    toast.present();
    });
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  changePassword() {
    let alert = this.alertCtrl.create({
      title: 'Change Password',
      buttons: [
        'Cancel'
      ]
    });
    alert.addInput({
      name: 'email',
      value: this.userData.getUserData().email,
      placeholder: ''
    });
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        let loader = this.loadingCtrl.create({
          content: 'sending you password reset link..'
        });
        loader.present();
        console.log(data);
        this.firebaseAuth.resetPassword(data.email).then(
          data => {
            console.log('Data ', data);
            let toast = this.toastCtrl.create({
              message: 'Check your email to reset your password',
              duration: 3000
            });
            loader.dismiss();
            toast.present();
          }, err => {
            console.log('Err ', err);
            let toast = this.toastCtrl.create({
              message: 'Error updating your password. Try again',
              duration: 3000
            });
            loader.dismiss();
            toast.present();
          }
        );
      }
    });

    alert.present();
  }

  getUsername() {
    this.username = this.userData.getUsername();
  }

  logout() {
    this.userData.logout();
    this.firebaseAuth.logoutUser(); 
    this.nav.setRoot(AllRecipesPage);
  }
  showFavorites() {
    this.nav.push(FavoritesPage);
  }
  showmyRecipes() {
    this.nav.push(MyRecipesPage);
  }
}
