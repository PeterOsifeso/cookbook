import { DessertPage } from './../pages/dessert/dessert';
import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TutorialPage } from '../pages/tutorial/tutorial';

import { UserData } from '../providers/user-data';
import { BreakfastPage } from '../pages/breakfast/breakfast';
import { LunchPage } from '../pages/lunch/lunch';
import { OtherPage } from '../pages/other/other';
import { FavoritesPage } from '../pages/favorites/favorites';
import { AllRecipesPage } from '../pages/all-recipes/all-recipes';
import { AddRecipePage } from '../pages/add-recipe/add-recipe';
import { StatusBar } from '@ionic-native/status-bar';
import { MyRecipesPage } from '../pages/my-recipes/my-recipes';
import { FirebaseAuthProvider } from '../providers/firebase-auth/firebase-auth';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.template.html'
})
export class ConferenceApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'All Recipes', name: 'AllRecipesPage', component: AllRecipesPage, index: 0, icon: 'basket' },
    { title: 'Breakfast', name: 'BreakfastPage', component: BreakfastPage, index: 1, icon: 'egg' },
    { title: 'Lunch', name: 'LunchPage', component: LunchPage, index: 2, icon: 'pizza' },
    { title: 'Dessert', name: 'DessertPage', component: DessertPage, index: 3, icon: 'ice-cream' },
    { title: 'Other', name: 'OtherPage', component: OtherPage, index: 4, icon: 'md-help-buoy' }
  ];
  loggedInPages: PageInterface[] = [
    { title: 'Add Recipe', name: 'SupportPage', component: AddRecipePage, icon: 'add' },
    { title: 'Favorites', name: 'FavoritesPage', component: FavoritesPage, index: 5, icon: 'md-heart' },
    { title: 'My Recipes', name: 'MyRecipesPage' , component: MyRecipesPage, icon: 'bookmark'},    
    { title: 'Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
    { title: 'Logout', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
    { title: 'Signup', name: 'SignupPage', component: SignupPage, icon: 'person-add' }
  ];
  rootPage: any;

  constructor(
    private statusBar: StatusBar,
    public firebaseAuth: FirebaseAuthProvider,
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public splashScreen: SplashScreen
  ) {
    // Check if the user has already seen the tutorial
    // const hasSeenTutorial = this.userData.checkHasSeenTutorial();
    this.rootPage = AllRecipesPage;
    this.platformReady();
  }

  openPage(page: PageInterface) {
    this.nav.setRoot(page.component);

    if (page.logsOut === true) {
      this.userData.logout();
      this.firebaseAuth.logoutUser();
    }
  }

  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  platformReady() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#8E12C1');
      this.splashScreen.hide();

      const hasLoggedIn = this.userData.hasLoggedIn();
      if (hasLoggedIn === true) {
        this.enableMenu(true);
      } else {
        this.enableMenu(false);
      }
      this.listenToLoginEvents();
    });
  }

  isActive(page: PageInterface) {
    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }
}
