import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { UserData } from '../../providers/user-data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ToastController } from 'ionic-angular';
import { MyRecipesPage } from '../my-recipes/my-recipes';
/**
 * Generated class for the AddRecipePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-recipe',
  templateUrl: 'add-recipe.html',
})
export class AddRecipePage {
  recipeForm: FormGroup;
  recipeImage: string;
  constructor(public loadingCtrl: LoadingController, public firebaseDb: FirebaseDbProvider, public userData: UserData, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController,  private camera: Camera, private fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewWillLoad() {
    this.initAddrecipeForm();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRecipePage');
  }
  initAddrecipeForm() {
    this.recipeForm = this.fb.group(
    {
      name: ['', [Validators.required]],
      category: ['lunch', Validators.required],
      time: ['', Validators.required],
      ingredients: new FormArray ([
        new FormControl('', Validators.required),
      ]),

      preparation: new FormArray([
        new FormControl('', Validators.required),
      ])
    }
    );
  }
  addIngredient() {
    const ingredients = this.recipeForm.get('ingredients') as FormArray;
    ingredients.push(new FormControl('', Validators.required));
  }
  addPreparation() {
    const preparation = this.recipeForm.get('preparation') as FormArray;
    preparation.push(new FormControl('', Validators.required));
  }
  popIngredient(index) {
    const ingredients = this.recipeForm.get('ingredients') as FormArray;
    ingredients.removeAt(index);
  }
  popPreparation(index) {
    const preparationSteps = this.recipeForm.get('preparation') as FormArray;
    preparationSteps.removeAt(index);
  }
  addRecipe() {
    // do the logic of adding recipe through recipeForm.value;
    let loader = this.loadingCtrl.create({
      content: "Adding recipe..."
    });
    loader.present();
    const newRecipe = {
      name: this.recipeForm.value.name,
      category: this.recipeForm.value.category,
      time: this.recipeForm.value.time,
      ingredients: this.recipeForm.value.ingredients,
      preparation: this.recipeForm.value.preparation,
      author: this.userData.getUsername(),
      image: this.recipeImage
    }
    const userRecipes = this.userData.getUserData().recipes;
    const recipeExist = userRecipes && userRecipes.length > 1 ? userRecipes.some(recipe => recipe.name === newRecipe.name): false;
    if (!recipeExist) {
      this.firebaseDb.addRecipe(this.userData.getUid(), newRecipe).then(
        data => {
          console.log('Recipe has been uploaded', data);
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: 'Recipe has been succesfully added!',
            duration: 3000
          });
          toast.present();
        }, err => {
          console.log('Error occurred while uploading', err);
          loader.dismiss();
          let toast = this.toastCtrl.create({
            message: 'An error occured!',
            duration: 3000
          });
          this.navCtrl.setRoot(MyRecipesPage);
          toast.present();
      });
    } else {
      loader.dismiss();
      let toast = this.toastCtrl.create({
        message: 'You already added this recipe!',
        duration: 3000
      });
      toast.present();
    };
  }
  selectRecipePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 300,
      targetHeight: 300,
      sourceType: 0
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let loader = this.loadingCtrl.create({
      content: "uploading photo ..."
    });
    loader.present();
     const base64Image = 'data:image/jpeg;base64,' + imageData;
     this.recipeImage = base64Image;
     loader.dismiss();
    }, (err) => {
     console.log('An error occurred', err);
     let toast = this.toastCtrl.create({
      message: 'Error uploading photo',
      duration: 3000
    });
    toast.present();
    });
  }
  takeRecipePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     const base64Image = 'data:image/jpeg;base64,' + imageData;
     this.recipeImage = base64Image;
     let toast = this.toastCtrl.create({
      message: 'Photo uploaded successfully',
      duration: 3000
    });
    toast.present();
    }, (err) => {
     console.log('An error occurred', err);
     let toast = this.toastCtrl.create({
      message: 'Error uploading photo',
      duration: 3000
    });
    toast.present();
    });
  }
  addRecipeImage() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload Recipe Image',
      buttons: [
        {
          text: 'Select from gallery',
          role: 'destructive',
          handler: () => {
            this.selectRecipePhoto();
          }
        },{
          text: 'Use Camera',
          handler: () => {
            this.takeRecipePhoto();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }
}
