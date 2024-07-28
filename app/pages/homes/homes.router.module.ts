import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomesPage } from './homes.page';

const routes: Routes = [
  {
   path: 'pages',
   component: HomesPage,
   children: [
     {
       path: 'friend',
       children: [
         {
           path: '',
           loadChildren: './friend/friend.module#FriendPageModule'
         }
       ]
     },
     {
       path: 'invitation',
       children: [
         {
           path: '',
           loadChildren: './invitation/invitation.module#InvitationPageModule'
         },
         {
           path: 'send',
           loadChildren: './invitation/invitation.module#InvitationPageModule'
         },
         { path: 'invite-detail/:id', loadChildren: './invitation/detail/detail.module#DetailPageModule' }
       ]
     },
     {
       path: 'message',
       children: [
         {
           path: '',
           loadChildren: './message/message.module#MessagePageModule'
         },
         { path: ':type/:id', loadChildren: './message/room/room.module#RoomPageModule' }
       ]
     },
     {
       path: 'like',
       children: [
         {
           path: '',
           loadChildren: './like/like.module#LikePageModule'
         },
         {
           path: ':tabs',
           loadChildren: './like/like.module#LikePageModule'
         }
       ]
     },
     {
       path: 'more',
       children: [
         { path: '', loadChildren: './more/more.module#MorePageModule' },
         { path: 'profile-manage', loadChildren: './more/profile-manage/profile-manage.module#ProfileManagePageModule' },
         { path: 'profile', loadChildren: './more/profile/profile.module#ProfilePageModule' },
         { path: 'profile/:id', loadChildren: './more/profile/profile.module#ProfilePageModule' },
         { path: ':type', loadChildren: './more/more.module#MorePageModule' }
       ]
     },
     {
       path: '',
       redirectTo: '/pages/more',
       pathMatch: 'full'
     }
   ]
 },
 {
   path: '',
   redirectTo: '/pages/more',
   pathMatch: 'full'
 }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomesPageRoutingModule {}