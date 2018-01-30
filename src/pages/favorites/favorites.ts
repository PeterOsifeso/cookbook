import { Recipe } from '../../models/recipe-model';
import { UserData } from './../../providers/user-data';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ViewRecipePage } from '../view-recipe/view-recipe';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
/**
 * Generated class for the FavoritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {
  favorites: Array<Recipe>;
  filteredRecipes: Array<Recipe>;
  queryText: string;
  constructor(public firebaseDb:FirebaseDbProvider, public alertCtrl:AlertController, public userData: UserData, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesPage');
    this.favorites = this.userData.getFavorites();
    this.filteredRecipes = this.favorites;
    this.firebaseDb.getUserFavoriteRecipes(this.userData.getUid()).then(
      (data: Array<any>) => {
        const recipes = [];
        data.forEach( recipe => {
          recipes.push(recipe.val());
        })
        console.log('initial recipes', recipes);
        if (recipes && recipes.length > 0) {
          this.favorites = recipes;
          this.filteredRecipes = recipes;
        }
      });
  }
  filterRecipes(): void {
    this.filteredRecipes = this.favorites.filter( recipe => recipe.name.toLowerCase().includes(this.queryText.toLowerCase()));
  }
  viewRecipe(recipe: Recipe): void {
    this.navCtrl.push(ViewRecipePage, {recipe: recipe});
  }
  removeRecipe(recipe: Recipe) {
    let confirm = this.alertCtrl.create({
      title: 'Delete Favorite?',
      message: 'Are you sure you want to remove '+ recipe.name+' from favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.userData.removeFavorite(recipe);
            this.filteredRecipes.splice(this.filteredRecipes.indexOf(recipe), 1);
            // this.favorites.splice(this.favorites.indexOf(recipe), 1);
            this.firebaseDb.removeFavoriteRecipe(this.userData.getUid(), recipe);
          }
        }
      ]
    });
    confirm.present();
  }
}
