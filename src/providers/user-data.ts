import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Recipe } from '../models/recipe-model';


@Injectable()
export class UserData {
  _favorites: Array<Recipe> = [];
  _myRecipes: Array<Recipe> = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    public events: Events,
    public storage: Storage,
  ) {
    this.loadFavorites();
    this.loadMyRecipes();
  }
  loadFavorites(): void {
    this.storage.get('favorites').then(
      data => {
        if ( data !== null) {
          this._favorites = data;
        }
      }, err => {
        console.log('An error occurred getting favs from local storage', err);
        this._favorites = [];
    });
  }
  getFavorites(): Array<Recipe> {
    return this._favorites;
  }
  hasFavorite(recipe: Recipe): boolean {
    return (this._favorites.some(favRecipe => recipe.name === favRecipe.name && recipe.author === favRecipe.author ));
  }

  addFavorite(recipe: Recipe): any {
    this._favorites.push(recipe);
    this.updateStorage(this._favorites);
  }

  removeFavorite(recipe: Recipe): void {
    let index = this._favorites.indexOf(recipe);
    if (index > -1) {
      this._favorites.splice(index, 1);
      this.updateStorage(this._favorites);
    }
  }
  updateStorage(favorites: Array<Recipe>): void {
    this.storage.set('favorites', favorites);
  }

  loadMyRecipes(): void {
    this.storage.get('myRecipes').then(
      data => {
        if ( data !== null) {
          this._myRecipes = data;
        }
      }, err => {
        console.log('An error occurred getting favs from local storage', err);
        this._myRecipes = [];
    });
  }
  getMyRecipes(): Array<Recipe> {
    return this._myRecipes;
  }
  hasMyRecipe(recipe: Recipe): boolean {
    return (this._myRecipes.some(favRecipe => recipe.name === favRecipe.name && recipe.author === favRecipe.author ));
  };

  addMyRecipe(recipe: Recipe): void {
    this._myRecipes.push(recipe);
    this.updateStorage(this._myRecipes);
  };

  removeMyRecipe(recipe: Recipe): void {
    let index = this._myRecipes.indexOf(recipe);
    if (index > -1) {
      this._myRecipes.splice(index, 1);
      this.updateStorage(this._myRecipes);
    }
  };


  login(username: string): void {
    window.localStorage.setItem(this.HAS_LOGGED_IN, 'true');
    this.setUsername(username);
    this.events.publish('user:login');
  };

  signup(username: string): void {
    window.localStorage.setItem(this.HAS_LOGGED_IN, 'true');
    this.setUsername(username);
    this.events.publish('user:signup');
  };

  logout(): void {
    window.localStorage.setItem(this.HAS_LOGGED_IN, null);
    this.events.publish('user:logout');
  };

  setUsername(username: string): void {
    window.localStorage.setItem('username', username);
  };

  getUsername(): string {
    return window.localStorage.getItem('username');
  };
  setHasLoggedIn(): void {
    window.localStorage.setItem(this.HAS_LOGGED_IN, 'true');
  }
  hasLoggedIn(): boolean {
    return window.localStorage.getItem(this.HAS_LOGGED_IN) === 'true';
  };
  setHasSeenTutorial(): void {
    window.localStorage.setItem(this.HAS_SEEN_TUTORIAL, 'true');
  }
  checkHasSeenTutorial(): boolean {
    return window.localStorage.getItem(this.HAS_SEEN_TUTORIAL) === 'true';
  };
  storeUserData(userData) {
    window.localStorage.setItem('userData', JSON.stringify(userData));
  }
  storeUid(uid) {
    window.localStorage.setItem('uid', uid);
  }
  getUserData() {
    return JSON.parse(window.localStorage.getItem('userData'));
  }
  getUid(): string {
    return window.localStorage.getItem('uid');
  }
  setProfilephoto(img) {
    const userData = this.getUserData();
    userData.profilePhoto = img;
    this.storeUserData(userData);
  }
  getProfilephoto(): string {
    const userData = this.getUserData();
    return userData.profilePhoto ? userData.profilePhoto : null;
  }
}
