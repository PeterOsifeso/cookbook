import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { Recipe } from '../../models/recipe-model';
import { ViewRecipePage } from '../view-recipe/view-recipe';

/**
 * Generated class for the LunchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-lunch',
  templateUrl: 'lunch.html',
})
export class LunchPage {
  lunchRecipes: Array<Recipe>;
  filteredRecipes: Array<Recipe>;
  queryText: string;
  constructor(public loadingCtrl: LoadingController, public firebaseDb:FirebaseDbProvider ,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    console.log('ionViewDidLoad lunchPage');
    this.firebaseDb.getAllRecipes().then(
      (data: Array<any>) => {
        const recipes = [];
        data.forEach( recipe => {
          recipes.push(recipe.val());
        })
        this.lunchRecipes = recipes.filter( recipe => recipe.category === 'lunch');
        this.filteredRecipes = this.lunchRecipes;
        loader.dismiss();
      });
  }
  filterRecipes(): void {
    this.filteredRecipes = this.lunchRecipes.filter( recipe => recipe.name.toLowerCase().includes(this.queryText.toLowerCase()));
  }
  viewRecipe(recipe): void {
    this.navCtrl.push(ViewRecipePage, {recipe: recipe});
  }
}
