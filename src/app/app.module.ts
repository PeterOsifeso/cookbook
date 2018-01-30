import { AddRecipePage } from './../pages/add-recipe/add-recipe';
import { HttpClientModule } from '@angular/common/http';
import { AllRecipesPage } from './../pages/all-recipes/all-recipes';
import { LunchPage } from './../pages/lunch/lunch';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { ConferenceApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TutorialPage } from '../pages/tutorial/tutorial';

import { UserData } from '../providers/user-data';
import { BreakfastPage } from '../pages/breakfast/breakfast';
import { ViewRecipePage } from '../pages/view-recipe/view-recipe';
import { DessertPage } from '../pages/dessert/dessert';
import { OtherPage } from '../pages/other/other';
import { FavoritesPage } from '../pages/favorites/favorites';
import { FirebaseDbProvider } from '../providers/firebase-db/firebase-db';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Camera } from '@ionic-native/camera';
import { FirebaseAuthProvider } from '../providers/firebase-auth/firebase-auth';
import { StatusBar } from '@ionic-native/status-bar';
import { MyRecipesPage } from '../pages/my-recipes/my-recipes';

@NgModule({
  declarations: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    AllRecipesPage,
    BreakfastPage,
    LunchPage,
    DessertPage,
    FavoritesPage,
    OtherPage,
    SignupPage,
    TutorialPage,
    ViewRecipePage,
    AddRecipePage,
    MyRecipesPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(ConferenceApp, {}, {
      links: [
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: TutorialPage, name: 'Tutorial', segment: 'tutorial' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' }
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    AboutPage,
    AllRecipesPage,
    BreakfastPage,
    LunchPage,
    DessertPage,
    FavoritesPage,
    OtherPage,
    ViewRecipePage,
    AddRecipePage,
    AccountPage,
    LoginPage,
    TutorialPage,
    SignupPage,
    MyRecipesPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    StatusBar,
    UserData,
    InAppBrowser,
    Camera,
    SplashScreen,
    SocialSharing,
    FirebaseDbProvider,
    FirebaseAuthProvider
  ]
})
export class AppModule { }
