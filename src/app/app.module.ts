import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { TodayFollowupsComponent } from './today-followups/today-followups.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomerFormComponent,
    TodayFollowupsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/follow-ups', pathMatch: 'full' },
      { path: 'follow-ups', component: TodayFollowupsComponent },
      { path: 'customer/new', component: CustomerFormComponent },
      { path: 'customer/edit/:id', component: CustomerFormComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }