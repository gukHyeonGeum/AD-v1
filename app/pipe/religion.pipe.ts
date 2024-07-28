import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'religion'
})
export class ReligionPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 1:
					return '종교 없음';
				break;
				case 2:
					return '기독교';
				break;
				case 3:
					return '불교';
				break;
				case 4:
					return '유교';
				break;
				case 5:
					return '카톨릭';
				break;
				case 6:
					return '천주교';
				break;
				case 7:
					return '원불교';
				break;
				case 8:
					return '천도교';
				break;
				case 9:
					return '도교';
				break;
				case 10:
					return '이슬람교';
				break;
				case 11:
					return '기타';
				break;
			}
  	}
  }

}
