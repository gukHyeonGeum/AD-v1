import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../../../pipe/pipes/pipes.module';

import { InvitePostPage } from './invite-post.page';

// import { PostInfoPage } from '../post-info/post-info.page';
// import { PostReviewPage } from '../post-review/post-review.page';
// import { PostCompletePage } from '../post-complete/post-complete.page';

const routes: Routes = [
  {
    path: '',
    component: InvitePostPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [InvitePostPage],
  entryComponents: []
})
export class InvitePostPageModule {}
