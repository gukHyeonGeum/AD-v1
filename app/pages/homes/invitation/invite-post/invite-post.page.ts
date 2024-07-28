import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { formatDate } from '@angular/common';

import { HttpErrorResponse } from '@angular/common/http';

import { AlertProvider } from '../../../../service/alert';
import { UserService } from '../../../../service/user.service';
import { InviteService } from '../../../../service/invite.service';

import { SearchMountPage } from '../../../modal/search-mount/search-mount.page';

import { PostInfoPage } from '../post-info/post-info.page';
import { PostReviewPage } from '../post-review/post-review.page';
import { PostCompletePage } from '../post-complete/post-complete.page';

import * as moment from 'moment';
import { VerifyService } from '../../../../service/verify.service';

@Component({
  selector: 'app-invite-post',
  templateUrl: './invite-post.page.html',
  styleUrls: ['./invite-post.page.scss'],
})
export class InvitePostPage implements OnInit {

	user: any;
	info: any;
	images = 'assets/icon/profile-none.jpg';
	mount = {
		name: '',
		id: ''
	};
	id: any;

	searchForm: FormGroup;
	nowYear = new Date();

	isProcess = false;

	private tabBar = document.getElementById('myTabBar');

  constructor(
  	public nav: NavController,
  	public us: UserService,
  	public is: InviteService,
  	public modal: ModalController,
  	public formBuilder: FormBuilder,
  	public activatedRoute: ActivatedRoute,
  	public toast: ToastController,
		public ap: AlertProvider,
		public verify: VerifyService
  ) {

  	this.id = this.activatedRoute.snapshot.paramMap.get('id');

  	this.searchForm = this.formBuilder.group({
      mId: ['', Validators.required ],
      mName: ['', Validators.required ],
  		mDate: ['', Validators.required ],
  		mTime: ['', Validators.required ],
  		mOption: ['', Validators.required ]
  	});	

  	if (this.id) {

  		this.is.getDetail(this.id)
	  		.subscribe(res => {

	  			if (res.success) {

	  				this.info = res.data;

				  	const in_time = moment(this.info.invite_time).format();

	  				this.searchForm.controls['mId'].setValue(this.info.mount_code);
	  				this.searchForm.controls['mName'].setValue(this.info.mount_name);
	  				this.searchForm.controls['mDate'].setValue(in_time);
	  				this.searchForm.controls['mTime'].setValue(in_time);
	  				this.searchForm.controls['mOption'].setValue(this.info.invite_option.toString());
	  				
	  			} else {

	  			}

	  		}, (err: HttpErrorResponse) => {

	        if (err.error instanceof Error) {
	        } else {
	        }
	      });
  	}

  }

  ngOnInit() {

  	// this.is.getTest().subscribe(res => {

  	// 	if (res.success) {
  	// 		this.complete(res.lists);	
  	// 	}
  		
  	// });

  	

  	console.log(this.nowYear);

  	this.us.getMe().subscribe(res => {
  		this.user = res.data;
  	});

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter-post');
  	if (this.tabBar.style.display !== 'none') this.tabBar.style.display = 'none';
  }

  ionViewWillLeave () {
  	if (this.tabBar.style.display !== 'flex') this.tabBar.style.display = 'flex';
  } 


	pad(n, width, z='') {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

  submit() {

		this.verify.isExpire().then(res => {
			if (res) {

				const obj = this.searchForm.value;
				obj.gender = this.user.profile.gender;
				console.log(obj);
				
				if (this.isProcess) {
					this.ap.alert('', { title: '초대장', message: '등록 진행중 입니다.' });
				} else {
					this.isProcess = true;
				}
		
				this.is.setInvite(obj)
					.subscribe(res => {
		
						this.isProcess = false;
						console.log(res);
		
						if (res.success) {
							this.complete(res.lists);
		
							let filter = res.data;
							filter.username = this.user.username;

							console.log(res.data);
		
							this.is.setSendList(filter).subscribe(res2 => {
								console.log(res2);
							});
		
						} else {
							this.ap.alert('', { title: '오류', message: res.message });
						}
		
					}, (err: HttpErrorResponse) => {
						this.isProcess = false;
						if (err.error instanceof Error) {
							console.log('An error occurred:', err.error.message);
						} else {
							console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
							console.log(err.error);
						}
					});

			} else {
				return;
			}
		});
	
  }

  modify() {
  	const obj = this.searchForm.value;
  	obj.id = this.id;

  	console.log(obj);

  	this.is.putInviteModify(obj)
  		.subscribe(async res => {

  			console.log(res);

  			if (res.success) {

  				const toast = await this.toast.create({
			      message: '초대장이 수정되었습니다.',
			      position: 'top',
			      duration: 1000
			    });
			    toast.present();

  				this.back();

  			} else {

  			}

  		}, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          console.log(err.error);
        }
      });
  }

  back() {
  	if (this.id) {
  		this.nav.navigateBack('pages/invitation/invite-detail/'+this.id);
  	} else {
  		this.nav.navigateBack('pages/invitation');
  		// this.nav.navigateBack('pages/invitation/send');
  	}
  }  

  async help() {
  	let modal = await this.modal.create({
      component: PostInfoPage,
      // componentProps: { id: userId, idx: index }
    });
    return await modal.present();
  }

  async review() {
  	let modal = await this.modal.create({
      component: PostReviewPage,
      componentProps: { info: this.searchForm.value, id: this.id }
    });
    modal.onDidDismiss().then(detail => {
    	console.log(detail);
    	if (detail.data) {
    		if (this.id) {
    			console.log(this.id);
    			this.modify();
    		} else {
    			this.submit();
    		}
    	}
    });
    return await modal.present();
  }

  async searchMount() {
  	console.log('searchMount');
  	let modal = await this.modal.create({
      component: SearchMountPage,
      // componentProps: { id: userId, idx: index }
    });

  	let _this = this;
    modal.onDidDismiss().then(detail => {
    	if (detail.data) {
	    	console.log(detail.data);
	    	// _this.mount = detail.data;
	    	this.searchForm.controls['mId'].setValue(detail.data._id);
	    	this.searchForm.controls['mName'].setValue(detail.data.name);

	    	console.log(this.searchForm.value);
	    }
    });

    return await modal.present();
  }

  async complete(filters) {
  	let modal = await this.modal.create({
      component: PostCompletePage,
      componentProps: { filters }
		});
		
		modal.onWillDismiss().then(() => {
			console.log('invite-post');
			this.nav.navigateBack('pages/invitation/send');
		});

    return await modal.present();
  }

}
