import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertController, ModalController, NavParams, IonSlides, ToastController, ActionSheetController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

import { FirebaseService } from '../../../service/firebase.service';

import { UserService } from '../../../service/user.service';
import { AlertProvider } from '../../../service/alert';
import { LoadingProvider } from '../../../service/loading';
import { PictureGuideComponent } from '../../modal/picture-guide/picture-guide.component'
import { CommonProvider } from '../../../service/common';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.page.html',
  styleUrls: ['./image-view.page.scss'],
})
export class ImageViewPage implements OnInit {

	@ViewChild(IonSlides) slides: IonSlides;
	@ViewChild('slider', { read: ElementRef })slider: ElementRef;

	private userId: any;
	private idx: any;
	user: any;
	slideIndex = 1;

	image: any;
	private images: Object[] = [];

	private selected_pic: any;

	private flag = false;

	sliderOpts = {
		initialSlide: 0,
		zoom: {
			maxRatio: 5
		}
	}

  constructor(
  	public alert: AlertController,
  	public _modal: ModalController, 
  	public navParams: NavParams,
  	private us: UserService,
  	private ap: AlertProvider,
  	public toast: ToastController,
  	public actionSheet: ActionSheetController,
  	public firebase: FirebaseService,
		public loding: LoadingProvider,
		public common: CommonProvider
  ) {
		this.userId = this.navParams.get('id');
  	this.idx = this.navParams.get('idx');
		this.image = this.navParams.get('image');
		
		this.sliderOpts.initialSlide = this.idx;
	}

  ngOnInit() {

  	if (this.userId) {
	  	this.us.getUser(this.userId).subscribe(res => {
	  		if (res) {
	  			this.user = res.data;
					this.selected_pic = this.user.pictures[this.idx];
	  		} else {
	  			this.ap.showErrorMessage('', res);
	  		}
	  	});
	  }

	  
  }

  change() {
  	this.slides.getActiveIndex().then(index => {
  		this.selected_pic = this.user.pictures[index];
  		this.slideIndex = index + 1;
  	});
  }

  close() {
    this._modal.dismiss(this.flag);
  }

	async pictureGuide() {
    let modal = await this._modal.create({
      component: PictureGuideComponent,
      componentProps: { birth: this.user.profile.birth }
		});
		modal.onWillDismiss().then(detail => {
			if (detail.data) {
				this.attach();
			}
		});
    return await modal.present();
	}

  async attach() {
  	let action = await this.actionSheet.create({
      header: '선택',
      buttons: [{
        text: '사진',
        icon: 'images',
        handler: () => {
          this.firebase.uploadPhotoProfile(this.user._id, 'photo').then((obj) => {
          	this.us.setPhotoProfile({ file_name: obj.url, faceCheck: true }).subscribe(res => {
          		if (res.success) {
          			this.user.pictures.splice(0, 0, res.data);
          			this.slides.slideTo(0, 0);
          			this.images.splice(0, this.user.pictures.length);

          			setTimeout(() => {
          				this.thumbnail(obj.thumb_url, res.data);
          			}, 5000);

								this.flag = true;
								
								this.common.firstPicture(this.user);

          			this.loding.hide();

          		} else {
								this.loding.hide();
								
								this.ap.alert('', { title: '사진등록 실패', message: res.message})
									.then(alert => {
										alert.onWillDismiss().then(() => {
											this.pictureGuide();
										});
									});
								
								setTimeout(() => {
									this.firebase.getThumbnail(obj.thumb_url)
										.then(url => {
											this.firebase.deleteImageFile('profile', this.user._id, obj.url);
											this.firebase.deleteImageFile('profile', this.user._id, url);
										});
								}, 5000);
          		}
          	}, err => {
						}, () => {
							this.loding.hide();
          	});

          });
        }
      }, {
        text: '카메라',
        icon: 'camera',
        handler: () => {
          this.firebase.uploadPhotoProfile(this.user._id, 'camera').then((obj) => {
          	this.us.setPhotoProfile({ file_name: obj.url, faceCheck: true }).subscribe(res => {
          		if (res.success) {
          			this.user.pictures.splice(0, 0, res.data);
          			this.slides.slideTo(0, 0);
          			this.images.splice(0, this.user.pictures.length);

          			setTimeout(() => {
          				this.thumbnail(obj.thumb_url, res.data);
          			}, 5000);

								this.flag = true;
								
								this.common.firstPicture(this.user);

          			this.loding.hide();

          		} else {
								this.loding.hide();
								
								this.ap.alert('', { title: '사진등록 실패', message: res.message})
									.then(alert => {
										alert.onWillDismiss().then(() => {
											this.pictureGuide();
										});
									});
								
								setTimeout(() => {
									this.firebase.getThumbnail(obj.thumb_url)
										.then(url => {
											this.firebase.deleteImageFile('profile', this.user._id, obj.url);
											this.firebase.deleteImageFile('profile', this.user._id, url);
										});
								}, 5000);
          		}
          	}, err => {
						}, () => {
							this.loding.hide();
          	});

          });
        }
      }, {
        text: '등록안내',
        icon: 'help-circle',
        handler: () => {
					this.pictureGuide();
        }
      }
		]
    });
    await action.present();
  }

  thumbnail(thumb_url, item) {
  	this.firebase.getThumbnail(thumb_url)
  		.then(url => {
  			this.us.putPictureThumb({ picture_id: item._id, thumb: url }).subscribe(() => {
  			});
  		});
  }

  async thumbHold(val) {
  	let action = await this.actionSheet.create({
  		header: '선택',
      buttons: [{
      	text: '대표사진으로 등록',
        icon: 'contact',
        handler: () => {
        	let pic = this.user.pictures[val-1];

        	this.us.putThumbConfig(pic).subscribe(async res => {
        		if (res.success) {
        			this.user.pictures.forEach((v, k) => {
        				if (v._id == pic._id) {
        					v.typical = 1;
        				} else {
        					v.typical = 0;
        				}
        			});

        			const toast = await this.toast.create({
					      message: '대표사진으로 등록되었습니다.',
					      position: 'top',
					      duration: 1000
					    });
					    toast.present();

					    this.flag = true;
        		}
        	});
        }
      }, {
      	text: '삭제하기',
        icon: 'trash',
        handler: async () => {
        	let pic = this.user.pictures[val-1];

					if (pic.typical) {

        		const alert = await this.alert.create({
				      header: '대표사진 삭제불가',
				      message: '다른사진을 대표사진으로 지정한 후 삭제 가능합니다.',
				      buttons: ['확인']
				    });
				    await alert.present();
        	
        	} else {

						const alert = await this.alert.create({
				      header: '',
				      message: '삭제하시겠습니까?',
				      buttons: [
				        {
				          text: '취소',
				          role: 'cancel',
				          cssClass: 'secondary',
				          handler: () => {
				          }
				        }, {
				          text: '확인',
				          handler: () => {
				            this.loding.show();

					        	this.us.deleteUserpictures({ id: pic._id }).subscribe(res => {
					        		if (res.success) {
												if (this.user.pictures.length == val) {
						        			this.slides.slideTo(val-2, 0);
						        		}
						        		this.user.pictures.splice(val-1, 1);

						        		if (pic.file_name.indexOf('firebasestorage') != -1) {
								        	this.firebase.deleteImageFile('profile', this.user._id, pic.file_name);
								        	if (pic.file_name != pic.thumb_name) {
								        		this.firebase.deleteImageFile('profile', this.user._id, pic.thumb_name);
								        	}
								        }

								        this.flag = true;
					        		} else {
					        			this.ap.showErrorMessage('', res);
					        		}
					        		this.loding.hide();
					        	}, (err: HttpErrorResponse) => {
							  			this.loding.hide();
							      });

				          }
				        }
				      ]
				    });

						await alert.present();        		
        		
        	}

        }
			}
			]
  	});
  	await action.present();
  }  

}
