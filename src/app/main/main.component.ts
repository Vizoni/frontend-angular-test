import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { UserService } from './../user/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @ViewChild(UserComponent) userComponent;
  searchText: string;
  downloadJsonHref;

  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  deleteSelectedUsers() {
    const idsToDelete = [];
    this.userService.getUsers().forEach(lista => {
      lista.filter((usuario) => {
        if (usuario.check) {
          idsToDelete.push(usuario.id);
        }
      })
    })
    this.userService.deleteUser(idsToDelete);
  }

  downloadSelectedUsers() {
    const arrayToDownload = [];
    this.userService.getUsers().forEach(lista => {
      lista.filter((user) => {
        if (user.check) {
          arrayToDownload.push(user);
        }
        const theJSON = JSON.stringify(arrayToDownload);
        const uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
        this.downloadJsonHref = uri;
      })
    })
  }


}
