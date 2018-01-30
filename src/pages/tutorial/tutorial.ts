import { Component, ViewChild } from '@angular/core';

import { MenuController, NavController, Slides } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { AllRecipesPage } from '../all-recipes/all-recipes';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})

export class TutorialPage {
  showSkip = true;

	@ViewChild('slides') slides: Slides;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public storage: Storage,
    public userData: UserData
  ) { }

  startApp() {
    this.navCtrl.setRoot(AllRecipesPage).then(() => {
      this.userData.setHasSeenTutorial();
    })
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.slides.update();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
