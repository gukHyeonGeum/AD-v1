import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reason'
})
export class ReasonPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 1:
					return '건강을 위해';
				break;
				case 2:
					return '즐거움을 찾고자';
				break;
				case 3:
					return '안정과 휴식을 위해';
				break;
				case 4:
					return '다이어트를 위하여';
				break;
				case 5:
					return '스트레스 풀려고';
				break;
				case 6:
					return '자신감,성취감 위해';
				break;
				case 7:
					return '대인관계를 위해';
				break;
			}
  	}
  }

}
