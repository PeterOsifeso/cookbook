import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { Recipe } from '../../models/recipe-model';
import { ViewRecipePage } from '../view-recipe/view-recipe';
/**
 * Generated class for the DessertPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-dessert',
  templateUrl: 'dessert.html',
})
export class DessertPage {
  dessertRecipes: Array<Recipe>;
  filteredRecipes: Array<Recipe>;
  queryText: string;
  constructor(public loadingCtrl: LoadingController, public firebaseDb:FirebaseDbProvider ,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    console.log('ionViewDidLoad dessertPage');
    this.firebaseDb.getAllRecipes().then(
      (data: Array<any>) => {
        const recipes = [];
        data.forEach( recipe => {
          recipes.push(recipe.val());
        })
        this.dessertRecipes = recipes.filter( recipe => recipe.category === 'dessert');
        this.filteredRecipes = this.dessertRecipes;
        loader.dismiss();
      });
  }
  filterRecipes(): void {
    this.filteredRecipes = this.dessertRecipes.filter( recipe => recipe.name.toLowerCase().includes(this.queryText.toLowerCase()));
  }
  viewRecipe(recipe): void {
    this.navCtrl.push(ViewRecipePage, {recipe: recipe});
  }
}
