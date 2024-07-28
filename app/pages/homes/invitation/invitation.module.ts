import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../../pipe/pipes/pipes.module';

import { InvitationPage } from './invitation.page';
import { FilterPopoverComponent } from './filter-popover/filter-popover.component';
import { InviteGuideComponent } from './invite-guide/invite-guide.component';

// import { InvitePostPage } from './invite-post/invite-post.page';

import { PostInfoPage } from './post-info/post-info.page';
import { PostCompletePage } from './post-complete/post-complete.page';


// import { InvitationPageRoutingModule } from './invitation.router.modules';

const routes: Routes = [
  {
    path: '',
    component: InvitationPage
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
    // InvitationPageRoutingModule
  ],
  declarations: [InvitationPage, FilterPopoverComponent, InviteGuideComponent, PostInfoPage, PostCompletePage],
  entryComponents: [FilterPopoverComponent, InviteGuideComponent, PostInfoPage, PostCompletePage]
})
export class InvitationPageModule {}
