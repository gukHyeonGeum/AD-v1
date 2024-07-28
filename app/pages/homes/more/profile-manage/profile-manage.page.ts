import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertController, ToastController, ActionSheetController, ModalController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

import { FirebaseService } from '../../../../service/firebase.service';
import { UserService } from '../../../../service/user.service';
import { AuthenticationService } from '../../../../service/authentication.service';
import { AlertProvider } from '../../../../service/alert';
import { LoadingProvider } from '../../../../service/loading';

import { SearchMountPage } from '../../../modal/search-mount/search-mount.page';
import { ImageViewPage } from '../../../modal/image-view/image-view.page';
import { PictureGuideComponent } from '../../../modal/picture-guide/picture-guide.component'
import { CommonProvider } from '../../../../service/common';

@Component({
  selector: 'app-profile-manage',
  templateUrl: './profile-manage.page.html',
  styleUrls: ['./profile-manage.page.scss'],
})
export class ProfileManagePage implements OnInit {

	private images: Object[] = [];
	user: any;
	private heights: Object[] = [];
	private weights: Object[] = [];
	private setClub: any;

	private tabBar = document.getElementById('myTabBar');

  constructor(
  	public alert: AlertController,
  	public us: UserService,
  	public auth: AuthenticationService,
  	public toast: ToastController,
  	public actionSheet: ActionSheetController,
  	public firebase: FirebaseService,
  	public modal: ModalController,
  	public ap: AlertProvider,
  	public loding: LoadingProvider,
		public cd: ChangeDetectorRef,
		public common: CommonProvider
  ) {

  	for (let i = 156; i <= 190; i++) {
  		this.heights.push(i);
  	}

  	for (let i = 46; i <= 90; i++) {
  		this.weights.push(i);
  	}

  	for (let i = 0; i < 3; i ++) {
  		this.images.push('assets/icon/profile-none.jpg');
  	}


  }

  ngOnInit() {
		this.getMe();
  }

  ionViewWillEnter() {
  	if (this.tabBar && this.tabBar.style.display !== 'none') this.tabBar.style.display = 'none';
  }

  ionViewWillLeave () {
    if (this.tabBar && this.tabBar.style.display !== 'flex') this.tabBar.style.display = 'flex';
  }

	getMe() {
  	this.us.getMe().subscribe(res => {
  		this.user = res.data;
  		this.user.profile.area 					= this.user.profile.area.toString();
  		this.user.profile.mt_day 				= this.user.profile.mt_day.toString();
  		this.user.profile.mt_frequency 	= this.user.profile.mt_frequency.toString();
  		this.user.profile.mt_career 		= this.user.profile.mt_career.toString();
  		this.user.profile.mt_level 			= this.user.profile.mt_level.toString();
  		this.user.profile.mt_reason 		= this.user.profile.mt_reason.toString();
  		this.user.profile.self_smoking 	= this.user.profile.self_smoking.toString();
  		this.user.profile.self_drinking = this.user.profile.self_drinking.toString();
  		this.user.profile.self_religion = this.user.profile.self_religion.toString();
  		this.user.profile.self_blood 		= this.user.profile.self_blood.toString();
  		this.user.profile.self_body 		= this.user.profile.self_body.toString();
  		this.user.profile.self_height 	= this.user.profile.self_height.toString();
  		this.user.profile.self_weight 	= this.user.profile.self_weight.toString();

	  	this.images.splice(0, this.user.pictures.length);
  	});
  }  

  async myInfo() {
  	const alert = await this.alert.create({
      header: '기본정보',
      message: `<div class="myInfo">
      <ion-item class="ion-no-padding" lines="none"><ion-label><strong>이름</strong></ion-label>${this.user.profile.realname}</ion-item>
      <ion-item class="ion-no-padding" lines="none"><ion-label><strong>성별</strong></ion-label>${this.user.profile.gender=='male'? '남자' : '여자'}</ion-item>
      <ion-item class="ion-no-padding" lines="none"><ion-label><strong>나이</strong></ion-label>${this.common.ageChange(this.user.profile.birth)}세</ion-item>
      <p class="ion-no-margin ion-margin-top">* 위 항목은 수정할 수 없습니다.</p>
      </div>`,
      buttons: ['확인']
    });
    await alert.present();
  }

  async nickChange() {
  	const alert = await this.alert.create({
      header: '닉네임',
      message: `<div>
      <ion-item class="ion-no-padding" lines="none"><ion-label><strong>현재</strong></ion-label>${this.user.username}</ion-item>
      <ion-item class="ion-no-padding" lines="none"><ion-label><strong>변경 (한글 2자~8자)</strong></ion-label></ion-item>
      </div>`,
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: '(예) 앵두친구'
        }
      ],
      cssClass: 'nick-change',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: '확인',
          handler: data => {
            
            if (data.username) {
          		this.us.putUsername({ username: data.username }).subscribe(async res => {

            		if (res.success) {

            			this.user.username = data.username;
            			
            			const toast = await this.toast.create({
							      message: '닉네임이 수정되었습니다.',
							      position: 'top',
							      duration: 1000
							    });
							    toast.present();
            		} else {
            			this.ap.showErrorMessage('', res);
            		}
            	});
            }

          }
        }
      ]
    });

    await alert.present();
  }

  profileChange(type, val) {

		this.us.putProfileChange({ type: type, val: val.detail.value }).subscribe(res => {
		});  	
  }

  introduce() {
		this.us.putIntroduce({ val: this.user.profile.self_introduce }).subscribe(async res => {
			const toast = await this.toast.create({
	      message: '내 소개가 수정되었습니다.',
	      position: 'top',
	      duration: 1000
	    });
	    toast.present();
		});
  }

	async pictureGuide() {
    let modal = await this.modal.create({
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
          			this.images.splice(0, this.user.pictures.length);

          			setTimeout(() => {
          				this.thumbnail(obj.thumb_url, res.data);
								}, 5000);
								
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
          			this.images.splice(0, this.user.pictures.length);

          			setTimeout(() => {
          				this.thumbnail(obj.thumb_url, res.data);
								}, 5000);
								
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
  			this.us.putPictureThumb({ picture_id: item._id, thumb: url }).subscribe(res => {
  			});
  		});
  }

  clubDelete(id, index) {
  	this.us.deleteUserClubs({ id: id }).subscribe(res => {
  		if (res.success) {
  			this.user.profile.mt_favorite.splice(index, 1);
  			this.cd.detectChanges();
  		} else {
  		}
  	});
  }
  
  async searchMount() {

	 	let modal = await this.modal.create({
      component: SearchMountPage,
    });

    modal.onDidDismiss().then(detail => {
    	if (detail.data) {
	    	this.us.setUserClubs({ name: detail.data.name, club_id: detail.data._id }).subscribe(res => {
	    		if (res.success) {
	    			this.setClub = res.data;
	    			this.user.profile.mt_favorite.push({ _id: this.setClub._id, name: detail.data.name, club_id: detail.data._id });
	    		} else {
	    		}
	    	});
	  	}
    });
    return await modal.present();
    
  }

  async imageViewModal(userId, index) {

  	if (!this.user.pictures.length) return;

    let modal = await this.modal.create({
      component: ImageViewPage,
      componentProps: { id: userId, idx: index }
    });
		modal.onDidDismiss().then(detail => {
			if (detail.data) {
				this.getMe();	
			}
    });    
    return await modal.present();
  }  

  async thumbHold(val, index) {
  	let action = await this.actionSheet.create({
  		header: '선택',
      buttons: [{
        text: '사진 추가하기',
        icon: 'images',
        handler: () => {

          this.attach();
        }
      }, {
      	text: '대표사진으로 등록',
        icon: 'contact',
        handler: () => {

        	this.us.putThumbConfig(val).subscribe(async res => {
        		if (res.success) {

        			this.user.pictures.forEach((v, k) => {
        				if (v._id == val._id) {
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
        		}
        	});
        }
      }, {
      	text: '삭제하기',
        icon: 'trash',
        handler: async () => {

        	if (val.typical) {
						
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
				          handler: data => {

				            this.loding.show();
					        	this.us.deleteUserpictures({ id: val._id }).subscribe(res => {
					        		if (res.success) {
					        			this.user.pictures.splice(index, 1);
						            if (this.user.pictures.length < 3) {
						            	this.images.push('assets/icon/profile-none.jpg');
						            }

						            if (val.file_name.indexOf('firebasestorage') != -1) {
								        	this.firebase.deleteImageFile('profile', this.user._id, val.file_name);
								        	if (val.file_name != val.thumb_name) {
								        		this.firebase.deleteImageFile('profile', this.user._id, val.thumb_name);
								        	}
								        }
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
