import { Component,ViewChild } from '@angular/core';
import { MediaService } from "../api/media.service";
import { ActionSheetController, Platform, LoadingController, ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('profilePhoto') profilePhoto;
  tagUsers : any = [];
  tagCompanles : any = [];
  tagStn : any = [];
  recipients : any = [];
  recipientsCom : any = [];
  recipientsStn : any = [];

  profile : any = [];
  proAvtr : any = [];
  profilePhotoOptions: FormGroup;
  todo: { 
    description: string, 
    users: string,
    companles : string,
    marijuanaStrain:string
   } = {
    description: '',
    users: '',
    companles : '',
    marijuanaStrain :''

};

  constructor(
      public media: MediaService,
      public actionSheetCtrl: ActionSheetController,
      public platform: Platform,
      private camera: Camera,
      public formBuilder: FormBuilder,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController
  ) {
    this.profilePhotoOptions = formBuilder.group({
			file: "assets/followthebirdImgs/no-profile-img.jpeg",
			type: "photos",
		});
  }

  

  searchTagUser(e) {
	this.tagUsers = [];
    this.media.getTagUser(this.todo.users).then(data => {
            let item = data[0];
            //console.log(item);
			for (var key in item) {
                
                this.recipients.filter((note)=>{note !==item[key]}) 
                const duplicateNote =  this.recipients.find((note) => note === item[key])
                if (!duplicateNote) {
                    this.tagUsers.push(item[key])
                }
            }
		});
  }

  searchTagCompanles(e){
    this.media.getTagUser(this.todo.companles).then(data => {
        let item = data[0];
        for (var key in item) {
            this.recipientsCom.filter((note)=>{note !==item[key]}) 
			const duplicateNote =  this.recipientsCom.find((note) => note === item[key])
			if (!duplicateNote) {
				this.tagCompanles.push(item[key])
			}
        }
    });
  }

  searchTagMarijuanaStrain(e){
    this.media.getTagUser(this.todo.marijuanaStrain).then(data => {
        let item = data[0];
        for (var key in item) {
            this.recipientsStn.filter((note)=>{note !==item[key]}) 
                const duplicateNote =  this.recipientsStn.find((note) => note === item[key])
                if (!duplicateNote) {
                    this.tagStn.push(item[key])
                }
        }
    });
  }

  addTag(item){
    this.recipients.push(item);
    this.tagUsers = [];
  }
  addCompanles(item){
    this.recipientsCom.push(item);
    this.tagCompanles = [];
  }

  addStn(item){
    this.recipientsStn.push(item);
    this.tagStn = [];
  }

  removeRecipient(item){
    var index = this.recipients.indexOf(item);
	  if (index !== -1) this.recipients.splice(index, 1);
    
	  //var user_id = this.recipIds.indexOf(item.user_id);
	  //if (index !== -1) this.recipIds.splice(user_id, 1);
	
  }

  async uploadProfilePicture() {
     
		const actionSheet = await this.actionSheetCtrl.create({
		  header: 'Upload Profile Picture',
		  buttons: [
			{
			  icon: !this.platform.is('ios') ? 'ios-camera' : null,	
			  text: 'Take a Picture',
			  handler: () => {
				  this.takeCameraSnap('profile')
			  }
			},{
			  icon: !this.platform.is('ios') ? 'ios-images' : null,		
			  text: 'Upload from gallery',
			  handler: () => {
          this.uploadFromGallery()
			  }
			},{
			  icon: !this.platform.is('ios') ? 'trash' : null,
			  text: 'Remove photo',
			  handler: () => {
				  //this.removePhoto({"my_id":localStorage.getItem('user_id'),"handle":"picture-user","id":this.profile_id})
			  }
			},{
			  icon: !this.platform.is('ios') ? 'close' : null,
			  text: 'Cancel',
			  role: 'cancel',
			  handler: () => {
			  }
			}
		  ]
		});
		actionSheet.present();
  }

  takeCameraSnap(type){

		const options: CameraOptions = {
		  quality: 500,
		  destinationType: this.camera.DestinationType.DATA_URL,
		  sourceType: this.camera.PictureSourceType.CAMERA,
		  encodingType: this.camera.EncodingType.JPEG,
		  mediaType: this.camera.MediaType.PICTURE,
		  allowEdit:true,
		  targetWidth: 500,
		  targetHeight: 500,
		  saveToPhotoAlbum: true,
		  correctOrientation: true //Corrects Android orientation quirks
		};	
		
		this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      let imgData = "data:image/jpeg;base64,"+imageData;	
      this.proAvtr = imgData;
		  if(type == 'profile'){		
        
        this.profilePhotoOptions.patchValue({ 'file': "data:image/jpeg;base64,"+imageData }); 
        this.uploadProfilePhoto(this.profilePhotoOptions);
		  }
		 }, (err) => {
			alert('Unable to take photo');
		 });
  }


  
  uploadFromGallery(){
		this.profilePhoto.nativeElement.click(); 
	}

  processWebImage(event) {
		let reader = new FileReader();
		reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      this.proAvtr = imageData;
      this.profilePhotoOptions.patchValue({ 'file': imageData });      
      this.uploadProfilePhoto(this.profilePhotoOptions);	  
		};
		reader.readAsDataURL(event.target.files[0]);
  }
  
  async uploadProfilePhoto(params){

		let loading = await this.loadingCtrl.create({
			cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
		});
		loading.present();

		 this.media.photoUploader(params).subscribe(async (resp) => {
			loading.dismiss();	
      this.profile.user_picture = resp;
			localStorage.setItem('user_picture',this.profile.user_picture);	
			const toast = await this.toastCtrl.create({
        message: 'Your settings have been saved.',
        duration: 2000
      });
      toast.present();

		}, async (err) => {
			loading.dismiss();		
		  const toast = await this.toastCtrl.create({
        message: 'failed to upload.',
        duration: 2000
      });
      toast.present();
		});
	}
	
  
  doPost(){
    this.media.doPost(this.todo).subscribe((resp) => {

    }, (err) => {

        
    });
  }

}
