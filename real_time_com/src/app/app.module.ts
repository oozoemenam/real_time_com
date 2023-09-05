import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MeetingComponent } from './meeting/meeting.component';

@NgModule({
  declarations: [AppComponent, MeetingComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [MeetingComponent],
})
export class AppModule {}
