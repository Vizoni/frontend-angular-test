import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

// import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { UserComponent } from './user/user.component';

import { UserService } from './user/user.service';
import { UserPipe } from './user/user.pipe';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    UserComponent,
    UserPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
