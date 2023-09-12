import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ConferenceComponent } from './conference/conference.component';
import { MeetingComponent } from './meeting/meeting.component';
import { VideoComponent } from './conference/video/video.component';

@NgModule({
  declarations: [AppComponent, MeetingComponent, ConferenceComponent, VideoComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [ConferenceComponent],
})
export class AppModule {}
