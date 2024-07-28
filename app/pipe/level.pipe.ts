import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'level'
})
export class LevelPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 1:
					return '뒷산워킹';
				break;
				case 2:
					return '등산초보자';
				break;
				case 3:
					return '일반등산인';
				break;
				case 4:
					return '등산매니아';
				break;
				case 5:
					return '캠핑매니아';
				break;
				case 6:
					return '트레킹매니아';
				break;
				case 7:
					return '클라이밍매니아';
				break;
			}
  	}
  }

}
