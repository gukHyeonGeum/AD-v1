import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'area'
})
export class AreaPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 1:
					return '서울';
				break;
				case 2:
					return '경기';
				break;
				case 3:
					return '인천';
				break;
				case 4:
					return '강원';
				break;
				case 5:
					return '경북';
				break;
				case 6:
					return '경남';
				break;
				case 7:
					return '충북';
				break;
				case 8:
					return '충남';
				break;
				case 9:
					return '전북';
				break;
				case 10:
					return '전남';
				break;
				case 11:
					return '제주';
				break;
			}
  	}
  }

}
