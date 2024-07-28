import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../../../pipe/pipes/pipes.module';

import { NoticePage } from './notice.page';
import { ContentComponent } from './content/content.component';

const routes: Routes = [
  {
    path: '',
    component: NoticePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [NoticePage, ContentComponent],
  entryComponents: [ContentComponent]
})
export class NoticePageModule {}
