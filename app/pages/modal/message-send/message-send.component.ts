import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { ModalController, NavParams, ToastController, IonContent } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Socket } from 'ngx-socket-io';

import { MessageProvider } from '../../../service/message';
import { VerifyService } from '../../../service/verify.service';

@Component({
  selector: 'app-message-send',
  templateUrl: './message-send.component.html',
  styleUrls: ['./message-send.component.scss']
})
export class MessageSendComponent implements OnInit {
	@ViewChild(IonContent, {read: ElementRef}) contentArea: ElementRef;
	
	images = 'assets/icon/profile-none.jpg';
	user: any;
	me: any;
	active = false;
	chip: string;
	msg = '';
	msgForm: FormGroup;
	action: boolean = false;

  constructor(
  	public modal: ModalController, 
  	public navParams: NavParams, 
  	public mp: MessageProvider,
  	public formBuilder: FormBuilder,
  	public socket: Socket,
		public toast: ToastController,
		public verify: VerifyService,
		public renderer: Renderer2,
		public el: ElementRef
  ) {

  	this.user = this.navParams.get('user');
  	this.me = this.navParams.get('me');

  	this.msgForm = this.formBuilder.group({
      message: ['', Validators.required ]
  	});	

  }

  ngOnInit() {
		
	}

  message(val) {
  	this.chip = val;
  	this.msg = this.mp.showMessage(val);
  	this.msgForm.controls['message'].setValue(this.msg);
  }

	submit() {

		this.verify.isExpire().then(async res => {
			if (res) {
				let msg = this.msgForm.value;
		
				let obj = {
					message: msg.message,
					user_id: this.me._id,
					target_id: this.user._id,
					thread_id: '',
					type: 'text',
					participant: '',
					created_at: new Date()
				}
		
				this.socket.emit('sendMessage', obj);
		
				const toast = await this.toast.create({
					message: '쪽지를 보냈습니다.',
					position: 'top',
					duration: 1000
				});
				toast.present();

				this.action = true;
				this.chip = '';
				this.msgForm.controls['message'].setValue('');

			} else {
				this.modal.dismiss('verify');
			}
		});

  }  

  close() {
  	this.modal.dismiss(this.action);
  }
}
