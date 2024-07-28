import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Socket } from 'ngx-socket-io';

import { UserService } from '../../../service/user.service';
import { AuthenticationService } from '../../../service/authentication.service';
import { AlertProvider } from '../../../service/alert';

import { ProfilePage } from '../../modal/profile/profile.page';
import { WelcomeComponent } from '../../modal/welcome/welcome.component';
import { PictureGuideComponent } from '../../modal/picture-guide/picture-guide.component';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {

	user: any;
  images = 'assets/icon/profile-none.jpg';
  private type: any;

  private tabBar = document.getElementById('myTabBar');

  constructor(
  	public storage: Storage,
  	public us: UserService,
  	public auth: AuthenticationService,
  	public modal: ModalController,
  	public nav: NavController,
    public ap: AlertProvider,
  	public socket: Socket,
    public toast: ToastController,
    public activatedRoute: ActivatedRoute,
    public cd: ChangeDetectorRef
  ) {

    this.type = this.activatedRoute.snapshot.paramMap.get('type');

  }

  ngOnInit() {

  }

  async welcome() {
    const toast = await this.toast.create({
      message: '회원가입 되었습니다.',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  ionViewWillEnter() {
    
    this.us.getMe().subscribe(res => {
      if (res.success) {
        this.user = res.data;

        this.auth.setMe(this.user);

        if (this.user.profile.profile_image)
          this.images = this.user.profile.profile_image;

        if (this.type == "welcome") {
          this.welcomeModal();

        }
      } else {
        this.auth.logout();
      }

      this.cd.detectChanges();
    });    

    if (this.tabBar.style.display !== 'flex') this.tabBar.style.display = 'flex';
  }

  profile() {
  	this.nav.navigateForward(['pages/more/profile']);
  }

  setting() {
    this.nav.navigateForward(['setting']);
  }

  moreMove(type: string) {
    if (type == 'payment') {
      this.nav.navigateForward(['payment']);
    } else if (type == 'profile-manage') {
      this.nav.navigateForward(['pages/more/profile-manage']);
    } else if (type == 'alarm') {
      this.nav.navigateForward(['alarm']);
    } else if (type == 'notice') {
      this.nav.navigateForward(['notice']);
    } else if (type == 'bugs') {
      this.nav.navigateForward(['bugs', 'bugs']);
    } else if (type == 'partner') {
      this.nav.navigateForward(['bugs', 'partner']);
    }
    
  }

  async welcomeModal() {
    let modal = await this.modal.create({
      component: WelcomeComponent,
      componentProps: { user: this.user }
    });
    return await modal.present();
  }

  async pictureGuide() {
    let modal = await this.modal.create({
      component: PictureGuideComponent,
    });
    return await modal.present();
  }

  async modalOpen(type) {
    let modal = await this.modal.create({
      component: ProfilePage,
      componentProps: { type: type }
    });
    return await modal.present();
  }


}
