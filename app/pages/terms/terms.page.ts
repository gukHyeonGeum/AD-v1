import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonContent, NavController, ModalController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { AggrementPage } from '../modal/aggrement/aggrement.page';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {

	private termsForm: FormGroup;
  private selAll: boolean = false;
  view = false;

  constructor(
  	private modal: ModalController,
  	private formBuilder: FormBuilder,
  	private storage: Storage,
  	private nav:NavController,
  	private auth:AuthenticationService
  ) {
  	this.termsForm = this.formBuilder.group({
  		aggrementA: ['', Validators.requiredTrue ],
  		aggrementB: ['', Validators.requiredTrue ],
  		aggrementC: [''],
  		aggrementD: ['']
  	});
  }

  ngOnInit() {

  	this.storage.get('terms').then((val) => {
      if (val) {
        this.nextPage();
      } else {
        this.view = true;
      }
    });
  }

  aggrementAll() {
    if (this.selAll == true) {
      this.selAll = false;
      this.termsForm.controls.aggrementA.patchValue(false);
      this.termsForm.controls.aggrementB.patchValue(false);
      this.termsForm.controls.aggrementC.patchValue(false);
      this.termsForm.controls.aggrementD.patchValue(false);
    } else {
      this.selAll = true;
      this.termsForm.controls.aggrementA.patchValue(true);
      this.termsForm.controls.aggrementB.patchValue(true);
      this.termsForm.controls.aggrementC.patchValue(true);
      this.termsForm.controls.aggrementD.patchValue(true);
    }
  }

  confirmation() {
    this.storage.set('terms', this.termsForm.value);

    this.nav.navigateRoot('certification');
  }

  nextPage() {
    this.nav.navigateRoot('certification');
  }

  async modalOpen(type) {
    const modal = await this.modal.create({
      component: AggrementPage,
      componentProps: { type: type }
    });
    return await modal.present();
  }

}
