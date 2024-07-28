import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inviteOption'
})
export class InviteOptionPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 1:
					return '산행&커피';
				break;
				case 2:
					return '산행&식사';
				break;
				case 3:
					return '산행&막걸리';
				break;
			}
  	}
  }

}
