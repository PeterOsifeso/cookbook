import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Recipe } from '../../models/recipe-model';
import { UserData } from './../../providers/user-data';
import { ViewRecipePage } from '../view-recipe/view-recipe';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
/**
 * Generated class for the MyRecipesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-recipes',
  templateUrl: 'my-recipes.html',
})
export class MyRecipesPage {
  myRecipes: Array<Recipe>;
  filteredRecipes: Array<Recipe>;
  queryText: string;
  constructor(public alertCtrl:AlertController, public firebaseDb: FirebaseDbProvider, public userData: UserData, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad myRecipesPage');
    this.myRecipes = this.userData.getMyRecipes();
    this.filteredRecipes = this.myRecipes;
    this.firebaseDb.getUserAddedRecipes(this.userData.getUid()).then(
      (data: Array<any>) => {
        const recipes = [];
        data.forEach( recipe => {
          recipes.push(recipe.val());
        })
        if (recipes && recipes.length > 0) {
          this.myRecipes = recipes;
          this.filteredRecipes = recipes;
        }
      });
  }
  filterRecipes(): void {
    this.filteredRecipes = this.myRecipes.filter( recipe => recipe.name.toLowerCase().includes(this.queryText.toLowerCase()));
  }
  viewRecipe(recipe: Recipe): void {
    this.navCtrl.push(ViewRecipePage, {recipe: recipe});
  }
  removeRecipe(recipe: Recipe) {
    let confirm = this.alertCtrl.create({
      title: 'Delete Favorite?',
      message: 'Are you sure you want to remove '+ recipe.name+' from recipes?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.filteredRecipes.splice(this.filteredRecipes.indexOf(recipe), 1);
            this.userData.removeFavorite(recipe);
            this.firebaseDb.removeSavedRecipe(this.userData.getUid(), recipe);
          }
        }
      ]
    });
    confirm.present();
  }
}
