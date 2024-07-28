import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-picture-guide',
  templateUrl: './picture-guide.component.html',
  styleUrls: ['./picture-guide.component.scss']
})
export class PictureGuideComponent implements OnInit {

  birth: any;
  age: any;

  constructor(
    public modal: ModalController,
    public navParams: NavParams
  ) { 
    this.birth = this.navParams.get('birth');

    this.age = this.transformDate(this.birth);
  }

  ngOnInit() {
    if (this.age < 40) {
      this.age = '30';
    } else {
      this.age = '40';
    }

  }

  transformDate(input) {
    var birth = input.split("-");
    var today = new Date();
    var year	= today.getFullYear()-1; 
    var month	= today.getMonth()+1;
    var day		= today.getDate();
    var ck		= parseInt(birth[0]);

    if(ck == 0) return "";

    var age = year - ck;
    var tmd = parseInt(month+''+day);
    var bmd = parseInt(birth[1]+''+birth[2]);

    if (tmd >= bmd) {
      age++;
    }
    
    return age;
  }

  close(flag) {
    this.modal.dismiss(flag);
  }

}
