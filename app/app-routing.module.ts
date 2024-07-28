import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    canActivate: [AuthGuard],
    loadChildren: './pages/homes/homes.module#HomesPageModule'
  },
  { path: 'certification', loadChildren: './pages/certification/certification.module#CertificationPageModule' },
  { path: 'user-profile', loadChildren: './pages/user-profile/user-profile.module#UserProfilePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'terms', loadChildren: './pages/terms/terms.module#TermsPageModule' },
  { path: 'profile/:id',canActivate: [AuthGuard], loadChildren: './pages/homes/more/profile/profile.module#ProfilePageModule' },
  { path: 'profile-manage',canActivate: [AuthGuard],loadChildren: './pages/homes/more/profile-manage/profile-manage.module#ProfileManagePageModule' },
  { path: 'message/:type/:id', loadChildren: './pages/homes/message/room/room.module#RoomPageModule' },   
  { path: 'setting', canActivate: [AuthGuard], loadChildren: './pages/homes/setting/setting.module#SettingPageModule' },
  { path: 'alarm', canActivate: [AuthGuard], loadChildren: './pages/homes/setting/alarm/alarm.module#AlarmPageModule' },
  { path: 'notice', canActivate: [AuthGuard], loadChildren: './pages/homes/setting/notice/notice.module#NoticePageModule' },
  { path: 'bugs/:type', canActivate: [AuthGuard], loadChildren: './pages/homes/setting/bugs/bugs.module#BugsPageModule' },
  { path: 'payment', canActivate: [AuthGuard], loadChildren: './pages/homes/payment/payment.module#PaymentPageModule' },
  { path: 'payment/history', canActivate: [AuthGuard], loadChildren: './pages/homes/payment/history/history.module#HistoryPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
