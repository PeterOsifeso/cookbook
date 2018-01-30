import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { UserData } from '../../providers/user-data';
import { Recipe } from '../../models/recipe-model';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the ViewRecipePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-view-recipe',
  templateUrl: 'view-recipe.html',
})
export class ViewRecipePage {
  recipe: Recipe;
  isFavorite: boolean = true;

  constructor(private firebaseDb: FirebaseDbProvider,private socialSharing: SocialSharing,public toastCtrl: ToastController, public alertCtrl: AlertController, public userData: UserData, public navCtrl: NavController, public navParams: NavParams) {
    this.recipe = this.navParams.data.recipe;
    console.log(this.recipe);
    this.isFavorite = this.userData.hasFavorite(this.recipe);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewRecipePage');
  }
  addToFavorite(): void {
    if (!this.isFavorite) {
      this.userData.addFavorite(this.recipe);
      this.firebaseDb.addFavoriteRecipe(this.userData.getUid(), this.recipe).then(
        data => {
          console.log('successfully added to fb', data);
        }, err => {
          console.log('An error occurred', err);
        }
      );
      this.isFavorite = true;
      let toast = this.toastCtrl.create({
        message: 'Recipe added to favorites',
        duration: 3000
      });
      toast.present();
    } else {
      // ask to remove from favorites
      let alert = this.alertCtrl.create({
        title: `Remove Favorite ?`,
        message: `Do you want to remove ${this.recipe.name} from favorites?`,
        buttons: [
          {
            text: 'Cancel'
          },
          {
            text: 'Remove',
            handler: () => {
              this.userData.removeFavorite(this.recipe);
              this.firebaseDb.removeFavoriteRecipe(this.userData.getUid(), this.recipe);
              this.isFavorite = false;
              let toast = this.toastCtrl.create({
                message: 'Recipe removed from favorites',
                duration: 3000
              });
              toast.present();
            }
          }
        ]
      });
      alert.present();
    }
  }
  shareViaFacebook() {
    const message = `How to prepare ${this.recipe.name} by CookBook \n Ingredients: ${this.recipe.ingredients.join(',')} 
                    \n Steps: ${this.recipe.preparation.join(',')}
                    \n Download CookBook App on the PlayStore for more recipes`;
    this.socialSharing.shareViaFacebook(message, this.recipe.image).then(
      data => {
        console.log('recipe has been shared to fb successfully', data);
      }, err => {
        console.log('An error occured while sharing', err);
    });
  }
  shareViaTwitter() {
    const message = `How to prepare ${this.recipe.name} by CookBook \n Ingredients: ${this.recipe.ingredients.join(',')} 
                    \n Steps: ${this.recipe.preparation.join(',')}
                    \n Download CookBook App on the PlayStore for more recipes`;
    this.socialSharing.shareViaTwitter(message, this.recipe.image).then(
      data => {
        console.log('recipe has been shared to twitter successfully', data);
      }, err => {
        console.log('An error occured while sharing', err);
    });
  }
  shareViaInstagram() {
    const message = `How to prepare ${this.recipe.name} by CookBook \n Ingredients: ${this.recipe.ingredients.join(',')} 
                    \n Steps: ${this.recipe.preparation.join(',')}
                    \n Download CookBook App on the PlayStore for more recipes`;
    this.socialSharing.shareViaInstagram(message, this.recipe.image).then(
      data => {
        console.log('recipe has been shared to instagram successfully', data);
      }, err => {
        console.log('An error occured while sharing', err);
    });
  }
}
