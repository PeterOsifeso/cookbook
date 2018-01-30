import { ViewRecipePage } from '../view-recipe/view-recipe';
import { Recipe } from '../../models/recipe-model';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController} from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
/**
 * Generated class for the BreakfastPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-breakfast',
  templateUrl: 'breakfast.html',
})
export class BreakfastPage {
  breakfastRecipes: Array<Recipe>;
  filteredRecipes: Array<Recipe>;
  queryText: string;
  constructor(public loadingCtrl: LoadingController, public firebaseDb:FirebaseDbProvider ,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    console.log('ionViewDidLoad BreakfastPage');
    this.firebaseDb.getAllRecipes().then(
      (data: Array<any>) => {
        const recipes = [];
        data.forEach( recipe => {
          recipes.push(recipe.val());
        })
        this.breakfastRecipes = recipes.filter( recipe => recipe.category === 'breakfast');
        this.filteredRecipes = this.breakfastRecipes;
        loader.dismiss();
      });
  }
  filterRecipes(): void {
    this.filteredRecipes = this.breakfastRecipes.filter( recipe => recipe.name.toLowerCase().includes(this.queryText.toLowerCase()));
  }
  viewRecipe(recipe): void {
    this.navCtrl.push(ViewRecipePage, {recipe: recipe});
  }

}
