import { Component, OnInit, Input } from '@angular/core';

import { UserService } from './user.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users = []; // itens para preencher tabela e cards
  userInModal = {}; // usado para preencher o modal
  userEdit = {}; // usado para preencher o modal
  @Input() searchTerm: string;  // termo de busca
  selectedUsersCounter = 0;   // contador de itens selecionados
  flagToMarkUnmark: boolean; // checkbox para marcar/desmarcar TODOS os usuários
  myModal;  // modal

  constructor(
    public userService: UserService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit() {
    this.userService.arrayOfUsers.subscribe((usuarios) => {
      this.users = usuarios;
    })
    this.userService.selectedUsersCounter.subscribe((counter) =>  {
      this.selectedUsersCounter = counter;
    })
  }

  selectSingleUser(userObject) {
    this.userService.setUserChecked(userObject.id, userObject.check);
    this.adjustSelectedUsersCounter(userObject);
  }

  getUserDetails(content, user) {
    this.userInModal = user;
    this.userEdit = Object.assign({}, user);
    this.myModal = this.modalService.open(content);
    this.myModal.result.then((newUser) => {
      if (newUser != undefined && this.userInModal != undefined) {
        if (this.userService.userDataHasChanged(newUser, this.userInModal)) {
          let confirmDialog = confirm("Deseja esquecer suas alterações?");
          if (!confirmDialog) {
            this.modalService.open(content);
          }
        }
      }

    });
  }

  editUser(newUser) {
    if (this.userService.userDataHasChanged(newUser, this.userInModal)) {
      this.userService.updateUser(newUser);
    }
    this.myModal.close();
  }

  deleteUser(user) {
    const arrayUserMocked = [user.id];
    this.userService.deleteUser(arrayUserMocked);
    this.selectedUsersCounter = 0;
  }

  selectAllUsers() {
    this.userService.getUsers().forEach((userList) => {
      userList.filter((user) => {
        this.userService.setUserChecked(user.id, this.flagToMarkUnmark);
        // ajusta o contador de usuários selecionados
        // se apenas ajustasse (this.adjustSelectedUsersCounter) e dps desmarcasse um,
        // na hora de zerar iria para -1. Por isso tive de fazer a validação com IF
        this.adjustSelectedUsersCounter(user);
      })
    })
  }

  private adjustSelectedUsersCounter(user) {
    // if (user.check && this.selectedUsersCounter <= this.users.length - 1) {
    //   this.selectedUsersCounter = this.selectedUsersCounter + 1;
    // } else if (!user.check) {
    //   this.selectedUsersCounter = this.selectedUsersCounter - 1;
    // } else if (!this.flagToMarkUnmark && user.check) {
    //   this.selectedUsersCounter = 0;
    // }
    // if (this.selectedUsersCounter < 0) {
    //   return this.selectedUsersCounter = 0;
    // }
    // return this.selectedUsersCounter;
    this.userService.adjustSelectedUsersCounter(this.flagToMarkUnmark, user);
  }


}
