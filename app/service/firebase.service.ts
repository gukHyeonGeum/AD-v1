import { Injectable } from '@angular/core';
import { LoadingProvider } from './loading';
import { AlertProvider } from './alert';
import { AngularFireStorage } from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { finalize } from 'rxjs/operators';

import { Observable } from 'rxjs';

import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private photoMessageOptions: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true,
    allowEdit: true,
    targetWidth: 800,
    targetHeight: 800
  };

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(
  	private storage: AngularFireStorage,
  	private camera: Camera,
  	private loadingProvider: LoadingProvider,
  	private alertProvider: AlertProvider
  ) { }

  imgURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
  }

  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  uploadPhotoProfile(conversationId, sourceType): Promise<any> {
  	return new Promise(resolve => {
			if (sourceType == 'photo') {
				sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
			} else if (sourceType == 'camera') {
				sourceType = this.camera.PictureSourceType.CAMERA;
			}
			this.photoMessageOptions.sourceType = sourceType;
  		this.loadingProvider.show();

  		this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
  			
        let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
        let metadata = {
          'contentType': imgBlob.type
       	};

       	let filename = this.generateFilename();

       	firebase.storage().ref().child('images/profile/' + conversationId + '/' + filename).put(imgBlob, metadata)
					.then((snapshot) => {

	        	snapshot.ref.getDownloadURL()
	        		.then(url => {
			        	let obj = {
			        		url : url,
			        		thumb_url : 'images/profile/' + conversationId + '/thumb_' + filename
			        	}

			          resolve(obj);
	        		});
	          
	        }).catch((error) => {
	          this.loadingProvider.hide();
	          this.alertProvider.showErrorMessage('image/error-image-upload', error);
	        });
      }).catch((error) => {
        this.loadingProvider.hide();
      });

  	});
  }

  getThumbnail(thumb_url): Promise<any> {
  	return new Promise(resolve => {
  		firebase.storage().ref().child(thumb_url).getDownloadURL()
      	.then(thumb => {
          resolve(thumb);	          		
      	}).catch(e => {
      		let that = this;
      		setTimeout(function() {
						return that.getThumbnail(thumb_url);      			
      		}, 5000);
      	});
  	});
  }

  uploadPhotoMessage(conversationId, sourceType): Promise<any> {
    return new Promise(resolve => {
			if (sourceType == 'photo') {
				sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
			} else if (sourceType == 'camera') {
				sourceType = this.camera.PictureSourceType.CAMERA;
			}
      this.photoMessageOptions.sourceType = sourceType;
      this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
        // Process the returned imageURI.
        let imgBlob = this.imgURItoBlob("data:image/jpeg;base64," + imageData);
        let metadata = {
          'contentType': imgBlob.type
       	};

       	let filename = this.generateFilename();


        // Generate filename and upload to Firebase Storage.
        firebase.storage().ref().child('images/chat/' + conversationId + '/' + filename).put(imgBlob, metadata)
					.then((snapshot) => {

	        	snapshot.ref.getDownloadURL()
	        		.then(url => {
			        	let obj = {
			        		url : url,
			        		thumb_url : 'images/chat/' + conversationId + '/thumb_' + filename
			        	}

			          resolve(obj);
	        		});

	        }).catch((error) => {
	          this.alertProvider.showErrorMessage('image/error-image-upload', error);
	        });
      }).catch((error) => {
      });
    });
  }

  deleteImageFile(type, conversationId, path) {
    var fileName = path.substring(path.lastIndexOf('%2F') + 3, path.lastIndexOf('?'));

    if (type == 'profile') {
			firebase.storage().ref().child('images/profile/' + conversationId + '/' + fileName).delete().then(() => { }).catch((error) => { });
    } else if (type == 'chat') {
    }
    
  }

}
