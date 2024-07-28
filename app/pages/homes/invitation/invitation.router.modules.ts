// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { InvitationPage } from './invitation.page';

// const routes: Routes = [
// 	 {
//     path: 'tabs',
//     component: InvitationPage,
//     children: [
//       {
//         path: 'request',
//         children: [
//           {
//             path: '',
//             loadChildren: './message/message.module#MessagePageModule'
//           }
//         ]
//       },
//       {
//         path: '',
//         redirectTo: '/pages/invitation/tabs/send',
//         pathMatch: 'full'
//       }
//     ]
//   },
//   {
//     path: '',
//     redirectTo: '/pages/invitation/tabs/send',
//     pathMatch: 'full'
//   }
// ];

// @NgModule({
//   imports: [
//     RouterModule.forChild(routes)
//   ],
//   exports: [RouterModule]
// })
// export class InvitationPageRoutingModule {}