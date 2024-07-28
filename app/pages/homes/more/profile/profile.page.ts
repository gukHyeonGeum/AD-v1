import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonSlides, NavController, ModalController, ActionSheetController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { LoadingProvider } from '../../../../service/loading';

import { UserService } from '../../../../service/user.service';
import { ImageViewPage } from '../../../modal/image-view/image-view.page';
import { AuthenticationService } from '../../../../service/authentication.service';
import { FirebaseService } from '../../../../service/firebase.service';

import { PictureGuideComponent } from '../../../modal/picture-guide/picture-guide.component'
import { CommonProvider } from '../../../../service/common';
import { AlertProvider } from 'src/app/service/alert';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

	@ViewChild(IonSlides) slides: IonSlides;

	private images = 'assets/icon/profile-none.jpg';
	private profile_img;
	private slideIndex = 1;
	user: any;
	private id: any;

	private tabBar = document.getElementById('myTabBar');

  constructor(
  	public nav: NavController,
  	public modal: ModalController,
  	public us: UserService,
  	public auth: AuthenticationService,
  	public actionSheet: ActionSheetController,
		public firebase: FirebaseService,
		public activatedRoute: ActivatedRoute,
		public loadingProvider: LoadingProvider,
		public common: CommonProvider,
		public cd: ChangeDetectorRef,
		public ap: AlertProvider
  ) { 
		this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
		this.profile_img = { 'height.px': window.innerWidth };
  }

  ionViewWillEnter() {
		this.getMe();
		

  	if (this.tabBar && this.tabBar.style.display !== 'none') this.tabBar.style.display = 'none';
  }

  ionViewWillLeave () {
    if (this.tabBar && this.tabBar.style.display !== 'flex') this.tabBar.style.display = 'flex';
  }

  getMe() {
  	this.us.getMe().subscribe(res => {
			if (res.success) {
				this.user = res.data;
				
				if (this.id) {
					this.modal.dismiss();
					this.pictureGuide();
					this.id = '';
				}
			} else {

			}
			this.cd.detectChanges();
  	});
  }

  change() {
  	this.slides.getActiveIndex().then(index => {
  		this.slideIndex = index + 1;
  	});
  }

  profileManager() {
  	this.nav.navigateForward('profile-manage');
  }

  thumbnail(thumb_url, item) {
  	this.firebase.getThumbnail(thumb_url)
  		.then(url => {
  			this.us.putPictureThumb({ picture_id: item._id, thumb: url }).subscribe(res => {
  			});
  		});
  }

  close() {
    this.nav.navigateBack('/');
  }

  async imageViewModal(userId, index) {

  	if (!this.user.pictures.length) return;

    let modal = await this.modal.create({
      component: ImageViewPage,
      componentProps: { id: userId, idx: index }
    });
		modal.onDidDismiss().then(detail => {
    	this.getMe();
    });    
    return await modal.present();
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

          			setTimeout(() => {
          				this.thumbnail(obj.thumb_url, res.data);
								}, 5000);

								this.common.firstPicture(this.user);								

          			this.loadingProvider.hide();
          		} else {
								this.loadingProvider.hide();
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
							this.loadingProvider.hide();
						});

          });
        }
      }, {
        text: '카메라',
        icon: 'camera',
        handler: () => {

          this.firebase.uploadPhotoProfile(this.user._id,'camera').then((obj) => {

          	this.us.setPhotoProfile({ file_name: obj.url, faceCheck: true }).subscribe(res => {
          		if (res.success) {
          			this.user.pictures.splice(0, 0, res.data);

          			setTimeout(() => {
          				this.thumbnail(obj.thumb_url, res.data);
								}, 5000);
								
								this.common.firstPicture(this.user);

          			this.loadingProvider.hide();

          		} else {
								this.loadingProvider.hide();
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
							this.loadingProvider.hide();
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
	
}
