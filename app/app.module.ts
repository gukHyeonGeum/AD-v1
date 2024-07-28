import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeKr from '@angular/common/locales/ko';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { WebIntent } from '@ionic-native/web-intent/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';

import { FCM } from '@ionic-native/fcm/ngx';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';

import * as firebase from 'firebase/app';
import * as moment from 'moment';

import { appSettings } from '../setting';
import { appConfig } from "../config";

import { PipesModule } from './pipe/pipes/pipes.module';

import { AlertProvider } from './service/alert';
import { LoadingProvider } from './service/loading';
import { MessageProvider } from './service/message';
import { IonicGestureConfig } from './service/gestureconfig';
import { CommonProvider } from './service/common';

import { ImageViewPage } from './pages/modal/image-view/image-view.page';
import { SearchMountPage } from './pages/modal/search-mount/search-mount.page';
import { PostReviewPage } from './pages/homes/invitation/post-review/post-review.page';
import { ProfilePage } from './pages/modal/profile/profile.page';
import { LikeCompleteComponent } from './pages/modal/like-complete/like-complete.component';
import { MessageSendComponent } from './pages/modal/message-send/message-send.component';
import { ReportComponent } from './pages/modal/report/report.component';
import { PictureGuideComponent } from './pages/modal/picture-guide/picture-guide.component';
import { PostComponent } from './pages/homes/invitation/post/post.component';

const config: SocketIoConfig = { url: appConfig.aengdoo.url, options: {} };

firebase.initializeApp(appSettings.firebaseConfig);

registerLocaleData(localeKr);
// registerLocaleData(localeKr, 'ko-KR', localeKrExtra);

@NgModule({
  declarations: [
  	AppComponent, 
  	ImageViewPage,
  	SearchMountPage,
    PostReviewPage,
    ProfilePage,
    LikeCompleteComponent,
    MessageSendComponent,
    ReportComponent,
    PictureGuideComponent,
    PostComponent
  ],
  entryComponents: [
  	ImageViewPage,
  	SearchMountPage,
    PostReviewPage,
    ProfilePage,
    LikeCompleteComponent,
    MessageSendComponent,
    ReportComponent,
    PictureGuideComponent,
    PostComponent
  ],
  imports: [
  	BrowserModule, 
  	IonicModule.forRoot(), 
  	SocketIoModule.forRoot(config), 
  	AppRoutingModule,
  	AngularFireModule.initializeApp(appSettings.firebaseConfig),
  	AngularFireStorageModule,
  	IonicStorageModule.forRoot(),
  	HttpClientModule,
  	PipesModule,
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HTTP,
    { provide: StorageBucket, useValue: 'mounting-api' },
    AlertProvider,
    LoadingProvider,
    MessageProvider,
    CommonProvider,
    {
        provide: HAMMER_GESTURE_CONFIG,
        useClass: IonicGestureConfig
    },
    Camera,
    FCM,
    Device,
    InAppPurchase2,
    AppVersion,
    AppUpdate,
    WebIntent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
