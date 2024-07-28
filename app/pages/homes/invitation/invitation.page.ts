import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, ModalController, IonInfiniteScroll, IonRefresher, PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';

import { AlertProvider } from '../../../service/alert';

import { InviteService } from '../../../service/invite.service';
import { UserService } from '../../../service/user.service';

import { ProfilePage } from '../../modal/profile/profile.page';
import { PostComponent } from './post/post.component';

import { FilterPopoverComponent } from './filter-popover/filter-popover.component';
import { InviteGuideComponent } from './invite-guide/invite-guide.component';
import { CommonProvider } from '../../../service/common';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.page.html',
  styleUrls: ['./invitation.page.scss'],
})
export class InvitationPage implements OnInit {
	@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
	@ViewChild(IonRefresher) refresher: IonRefresher;

	images = 'assets/icon/profile-none.jpg';
	whichPage = 'receive';
	user: any;
	lists: any = [];
	type: any;
	history: string;
	flag: boolean;
	
	private limit = 10;
	private skip = 0;
	nowDate = new Date();
	
  constructor(
  	public nav: NavController,
  	public is: InviteService,
  	public us: UserService,
  	public ap: AlertProvider,
  	public activatedRoute: ActivatedRoute, 
  	public router: Router, 
  	public modal: ModalController,
		public cd: ChangeDetectorRef,
		public popover: PopoverController,
		public common: CommonProvider
  ) {
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
		this.skip = 0;

  	this.us.getMe().subscribe(res => {
			if (res.success) {
				this.user = res.data;
			} else {
				if (res.errCode) {
					this.common.authCheck(res);
				} else {
					this.ap.alert('', { title: '오류', message: res.message});
				}
			}
  	});  	

  	if (this.router.url == '/pages/invitation/send') {
  		this.whichPage = 'send';
  	}

  	const tabBar = document.getElementById('myTabBar');
  	if (tabBar.style.display !== 'flex') tabBar.style.display = 'flex';

  	this.getInviteLists();

  }

  getInviteLists(type: string='') {
  	if (!this.skip) this.lists = [];

  	this.is.getInviteLists(this.whichPage, this.skip, this.limit, type).subscribe(res => {
			if (res.success) {
  			if (this.skip) {
					this.lists = this.lists.concat(res.data);
					this.infiniteScroll.complete();
					
					if (res.data.length < this.limit) {
						this.infiniteScroll.disabled = true;
						this.skip = 0;
					}
				} else {
					this.lists = res.data;
					this.flag = res.flag;
  				this.refresher.complete();

  				if (this.lists.length >= this.limit) {
  					this.infiniteScroll.disabled = false;
  				} else {
  					this.infiniteScroll.disabled = true;
  				}

  				this.cd.detectChanges();
  			}
  		} else {
  			this.ap.alert('', { title: '오류', message: res.message });
  		}

		}, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        this.ap.alert('', { title: '오류', message: err.error.message });
      } else {
        this.ap.alert('', { title: '오류', message: err.error });
      }
    });
  }

  loadData() {
  	this.skip = this.skip + this.limit;

  	this.getInviteLists();
  }

  doRefresh() {
    this.segmentChanged({ detail: { value: this.whichPage } });
  }

  segmentChanged(event) {
  	this.skip = 0;
  	this.infiniteScroll.disabled = false;
  	this.flag = false;
  	this.whichPage = event.detail.value;

  	this.getInviteLists();
  }

  write() {
	}
	
	async writeModal() {
		let modal = await this.modal.create({
			component: PostComponent,
		});
		modal.onWillDismiss().then(() => {
			this.segmentChanged({ detail: { value: 'send' } });
	  	this.whichPage = "send";
		});
		return await modal.present();
	}

  detail(list, type) {
  	let id: number;

  	if (type == 'send') {
  		id = list._id;
  	} else {
  		id = list.invitation._id;
  	}

		this.nav.navigateForward(['pages/invitation/invite-detail', id]);
	}

	loadDefault(event) {
    event.target.src = 'assets/icon/profile-none.jpg';
  }

	async filters(ev:any) {
		const popover = await this.popover.create({
			component: FilterPopoverComponent,
			componentProps: { user: this.user, tabs: this.whichPage },
			event: ev,
			translucent: true,
			mode: 'ios'
		});

		popover.onDidDismiss().then(detail => {
			if (detail.data) {
				this.getInviteLists(detail.data);
			}
		});

		return await popover.present();
	}

  async ModalProfile(user) {
    let modal = await this.modal.create({
      component: ProfilePage,
      componentProps: { user }
    });
    return await modal.present();
	}
	
	async ModalInviteGuide() {
    let modal = await this.modal.create({
      component: InviteGuideComponent
		});
		modal.onWillDismiss().then(detail => {
			this.writeModal();
		});
    return await modal.present();
  }

}
