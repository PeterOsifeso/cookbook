import { ViewRecipePage } from '../view-recipe/view-recipe';
import { AccountPage } from '../account/account';
import { Component, ViewChild } from '@angular/core';
import { AlertController, App, FabContainer, List, ModalController, NavController, ToastController, LoadingController } from 'ionic-angular';


import { UserData } from '../../providers/user-data';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { Recipe } from '../../models/recipe-model';

@Component({
  selector: 'page-all-recipes',
  templateUrl: 'all-recipes.html',
})
export class AllRecipesPage {

  @ViewChild('scheduleList', { read: List }) scheduleList: List;

    queryText = '';
    allRecipes: Array<Recipe>;
    filteredRecipes: Array<Recipe>;
    isLoggedIn: boolean;
  
    constructor(
      public userData: UserData,
      public alertCtrl: AlertController,
      public app: App,
      public loadingCtrl: LoadingController,
      public modalCtrl: ModalController,
      public navCtrl: NavController,
      public toastCtrl: ToastController,
      public user: UserData,
      public firebaseDb: FirebaseDbProvider,
    ) {}
  
    ionViewDidLoad() {
      this.isLoggedIn = this.userData.hasLoggedIn();
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      this.firebaseDb.getAllRecipes().then(
        (data: Array<any>) => {
          const recipes = [];
          data.forEach( recipe => {
            recipes.push(recipe.val());
          });
          console.log('Recipes', recipes);
          this.allRecipes = recipes;
          this.filteredRecipes = recipes;
          loader.dismiss();
        }, err => {
          console.log('Err ', err);
          let toast = this.toastCtrl.create({
            message: 'Check your network connection and try again',
            duration: 3000
          });
          toast.present();
        });
    }
    goToProfile(): void {
      this.navCtrl.push(AccountPage);
    }
    viewRecipe(recipe): void {
      this.navCtrl.push(ViewRecipePage, {recipe: recipe});
    }
    filterRecipes(): void {
      console.log(this.queryText);
      this.filteredRecipes = this.allRecipes.filter( recipe => recipe.name.toLowerCase().includes(this.queryText.toLowerCase()));
    }
  
    openSocial(network: string, fab: FabContainer) {
      let loading = this.loadingCtrl.create({
        content: `Posting to ${network}`,
        duration: (Math.random() * 1000) + 500
      });
      loading.onWillDismiss(() => {
        fab.close();
      });
      loading.present();
    }
  }
  