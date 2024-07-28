import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Socket } from 'ngx-socket-io';

import { UserService } from '../../service/user.service';
import { Storage } from '@ionic/storage';
import { CommonProvider } from '../../service/common';

@Component({
  selector: 'app-homes',
  templateUrl: './homes.page.html',
  styleUrls: ['./homes.page.scss'],
})
export class HomesPage implements OnInit {

  private user: any;
  public badge: any = [];

  constructor(
  	public socket: Socket,
    public us: UserService,
    public storage: Storage,
    public common: CommonProvider,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {

  	this.us.getMe().subscribe(res => {
  		if (res.success) {
  			this.user = res.data;
	  		this.socket.emit('login', this.user._id);

		  	this.socket.on('check', (data) => {
		  		this.socket.emit('login', this.user._id);
        });	  		
        
        this.socket.on('getBadgeCount', () => {
          this.common.getBadge();
        });
      }
      this.cd.detectChanges();
    });

    this.common.getBadge();

    this.common.dataBadge.subscribe(data => {
      this.badge = data;
    });

    
  }

  refreshBadge() {
    this.common.getBadge();
  }
}
