import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonSlides } from '@ionic/angular';
import { UserService } from '../../../../service/user.service';

@Component({
  selector: 'app-invite-guide',
  templateUrl: './invite-guide.component.html',
  styleUrls: ['./invite-guide.component.scss']
})
export class InviteGuideComponent implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  user: any = [];
  guideInfo: any = [];
  guideNum = 0;
  images = 'assets/icon/profile-none.jpg';
  nowDate = new Date();

  constructor(
    public modal: ModalController,
    public us: UserService
  ) {
    
    this.guideInfo = {
      title: ['초대장 발송안내','① 초대장 작성','② 초대장 발송(예시)','③ 파트너 선택','④ 초대장 매치!']
    }

  }

  ngOnInit() {
    this.us.getMe().subscribe(res => {
      this.user = res.data;
      if (this.user.profile.profile_image)
        this.images = this.user.profile.profile_image;
    });    
  }

  change(event:any) {
  	this.slides.getActiveIndex().then(index => {
      this.guideNum = index;
  	});
  }

  next() {
    this.slides.slideNext();
  }

  close() {
    this.modal.dismiss();
  }

}
