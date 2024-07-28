import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, ToastController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';

import { UserService } from '../../../../service/user.service';
import { InviteService } from '../../../../service/invite.service';
import { AlertProvider } from '../../../../service/alert';
import { VerifyService } from '../../../../service/verify.service';

import { SearchMountPage } from '../../../modal/search-mount/search-mount.page';
import { PostReviewPage } from '../post-review/post-review.page';
import { PostCompletePage } from '../post-complete/post-complete.page';
import { InviteGuideComponent } from '../invite-guide/invite-guide.component';

import * as moment from 'moment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

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
	MinDate = moment(this.nowYear).format();

	isProcess = false;

  private tabBar = document.getElementById('myTabBar');
  
  constructor(
    public _modal: ModalController,
    public nav: NavController,
  	public us: UserService,
  	public is: InviteService,
  	public formBuilder: FormBuilder,
  	public activatedRoute: ActivatedRoute,
  	public toast: ToastController,
		public ap: AlertProvider,
    public verify: VerifyService,
    public navParams: NavParams
  ) { 
    this.id = this.navParams.get('id');

	
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
    this.us.getMe().subscribe(res => {
  		this.user = res.data;
  	});
  }

  ionViewWillEnter() {
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
				
				if (this.isProcess) {
					this.ap.alert('', { title: '초대장', message: '등록 진행중 입니다.' });
				} else {
					this.isProcess = true;
				}
		
				this.is.setInvite(obj)
					.subscribe(res => {
		
						this.isProcess = false;
		
						if (res.success) {
              this._modal.dismiss();

              this.complete(res.lists);
              
							let filter = res.data;
							filter.username = this.user.username;

							this.is.setSendList(filter).subscribe(res2 => {
							});
		
						} else {
							this.ap.alert('', { title: '오류', message: res.message });
						}
		
					}, (err: HttpErrorResponse) => {
						this.isProcess = false;
					});

			} else {
				return;
			}
		});
	
  }

  modify() {
  	const obj = this.searchForm.value;
  	obj.id = this.id;

  	this.is.putInviteModify(obj)
  		.subscribe(async res => {

  			if (res.success) {

  				const toast = await this.toast.create({
			      message: '초대장이 수정되었습니다.',
			      position: 'top',
			      duration: 1000
			    });
			    toast.present();

  				this.close();

  			} else {

  			}

  		}, (err: HttpErrorResponse) => {
      });
  }

  async help() {
  	let modal = await this._modal.create({
      component: InviteGuideComponent,
      // componentProps: { id: userId, idx: index }
    });
    return await modal.present();
  }

  async review() {
  	let modal = await this._modal.create({
      component: PostReviewPage,
      componentProps: { info: this.searchForm.value, id: this.id }
    });
    modal.onDidDismiss().then(detail => {
    	if (detail.data) {
    		if (this.id) {
    			this.modify();
    		} else {
    			this.submit();
    		}
    	}
    });
    return await modal.present();
  }

  async searchMount() {
  	let modal = await this._modal.create({
      component: SearchMountPage,
      // componentProps: { id: userId, idx: index }
    });

  	let _this = this;
    modal.onDidDismiss().then(detail => {
    	if (detail.data) {
	    	// _this.mount = detail.data;
	    	this.searchForm.controls['mId'].setValue(detail.data._id);
	    	this.searchForm.controls['mName'].setValue(detail.data.name);
	    }
    });

    return await modal.present();
  }

  async complete(filters) {
  	let modal = await this._modal.create({
      component: PostCompletePage,
      componentProps: { filters }
		});

    return await modal.present();
  }
  
  close() {
    this._modal.dismiss();
  }

}
