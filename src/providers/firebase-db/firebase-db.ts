import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { UserData } from '../user-data';
/*
  Generated class for the FirebaseDbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseDbProvider {
  firebaseDatabase: any
  constructor(public http: HttpClient, public userData:UserData) {
    // const fbConf = {
    //   apiKey: 'AIzaSyDnkX2i1_fF1_S0APOT5XT3nKGiwzwThyQ',
    //   authDomain: 'cookbook-2b271.firebaseapp.com',
    //   databaseURL: 'https://cookbook-2b271.firebaseio.com',
    //   projectId: 'cookbook-2b271',
    //   storageBucket: 'cookbook-2b271.appspot.com',
    //   messagingSenderId: '18016782020'
    // };
    console.log('Hello FirebaseDB');
    this.firebaseDatabase = firebase.database();
  }
  addFavoriteRecipe(userId: string, recipe): any {
    const favoritesListRef = this.firebaseDatabase.ref('users/' + userId).child('favorites');
    return favoritesListRef.push(recipe);
  }
  updateUserData(userId, userData): any {
    return this.firebaseDatabase.ref('users/' + userId).set({
      username: userData.username,
      email: userData.email,
      favorites: userData.favorites,
      recipes: userData.recipes,
      profilePhoto: userData.profilePhoto
    });
  }
  addRecipe(userId, recipe): any {
    // will add recipe both on the user recipe list and on the global recipe list
    const newRecipeKey = this.firebaseDatabase.ref('recipes/').push().key;
    const newUserRecipeKey = this.firebaseDatabase.ref('users/' + userId).child('recipes').push().key;
    let updates = {};
    updates['/users/'+ userId +'/recipes/' + newUserRecipeKey] = recipe;
    updates['/recipes/'+ newRecipeKey] = recipe;
    return this.firebaseDatabase.ref().update(updates);
  }
  removeFavoriteRecipe(userId, recipe) {
    this.firebaseDatabase.ref('users/' + userId).child('favorites').once('value').then(data => {
        const recipes = [];
        data.forEach(recipe => {
          recipes.push(recipe.val());
        });
        const indexToRemove = this.findIndexWithAttr(recipes, 'name', recipe.name);
        console.log('Removeing at index from user', indexToRemove);
        console.log('recipes ', recipes);
        recipes.splice(indexToRemove, 1);
        this.firebaseDatabase.ref('users/' + userId).child('favorites').set(recipes);
      }
    );
  }
 findIndexWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
  }

  removeSavedRecipe(userId, recipe): any {
    // remove globally
    this.firebaseDatabase.ref('recipes/').once('value').then(
      data => {
        const recipes = [];
        data.forEach(recipe => {
          recipes.push(recipe.val());
         });
        const indexToRemove = this.findIndexWithAttr(recipes, 'name', recipe.name);
        recipes.splice(indexToRemove, 1);
        this.firebaseDatabase.ref('/recipes').set(recipes);
      }
    );
    // remove from user data
    this.firebaseDatabase.ref('users/' + userId).child('recipes').once('value').then(
      data => {
        const recipes = [];
        data.forEach(recipe => {
          recipes.push(recipe.val());
         });
        const indexToRemove = this.findIndexWithAttr(recipes, 'name', recipe.name);
        recipes.splice(indexToRemove, 1);
        this.firebaseDatabase.ref('/users/' + userId).child('recipes').set(recipes);
      }
    );
  }
  addUserData(userId, userData): any {
    return firebase.database().ref('/users/' + userId).set({
      username: userData.username,
      email: userData.email,
      favorites: [],
      recipes: [],
      profilePhoto: ''
    });
  }
  
  getUser(userId: string): any {
    return this.firebaseDatabase.ref('/users/' + userId).once('value');
  }

  updateProfilePhoto(userId: string, profilePhoto: string): any {
    return this.firebaseDatabase.ref('/users/' + userId).child('profilePhoto').set(profilePhoto);
  }
  getAllRecipes(): any {
    return this.firebaseDatabase.ref('/recipes/').once('value');
  }
  getUserFavoriteRecipes(userId): any {
    return this.firebaseDatabase.ref('/users/' + userId).child('favorites').once('value');
  }
  getUserAddedRecipes(userId): any {
    return this.firebaseDatabase.ref('/users/' + userId).child('recipes').once('value');
  }
}

