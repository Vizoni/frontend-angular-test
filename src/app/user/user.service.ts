import { Injectable } from '@angular/core';

import { User } from './user.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserService {

    arrayOfUsers = new BehaviorSubject<any[]>(User);   // pega do MOCK do arquivo "user.model.ts" da pasta /src/app/user
    users = this.arrayOfUsers.asObservable();
    selectedUsersCounter = new BehaviorSubject<number>(0);

    constructor() { }

    public getUsers() {
        // SUBSTITUIR AQUI POR RETORNO DA API (TEM Q RETORNAR ARRAY DE OBJETOS)
        return this.users;
    }

    public setUserChecked(id, status) {
        this.getUserById(id).check = status;
    }

    public userDataHasChanged(oldData, newData) {
        if (oldData.firstName != newData.firstName || oldData.lastName != newData.lastName) {
            return true;
        } else {
            return false;
        }
    }

    public getUserById(id: number) {
        let user;
        this.users.forEach((lista) => {
            user = lista.filter((usuario) => {
                if (usuario.id === id) {
                    return usuario;
                }
            })
        })
        return user[0];
    }

    public updateUser(user) {
        const arrayOfUsersUpdated = [];
        const list = this.arrayOfUsers.getValue()
            .filter(item => {
                if (item.id === user.id) {
                    item = user;
                }
                arrayOfUsersUpdated.push(item);
            });
        this.arrayOfUsers.next(arrayOfUsersUpdated);
    }

    public deleteUser(arrayOfUsersToDelete) {
        if (arrayOfUsersToDelete.length == 1) {
            const list = this.arrayOfUsers.getValue()
                .filter(item => {
                    return item.id != arrayOfUsersToDelete;
                });
            this.arrayOfUsers.next(list);
        } else {
            arrayOfUsersToDelete.forEach(element => {
                const list = this.arrayOfUsers.getValue()
                    .filter(item => {
                        return item.id != element;
                    });
                this.arrayOfUsers.next(list);
            });
        }
        this.selectedUsersCounter.next(0);
    }

    public adjustSelectedUsersCounter(flag, user) {
        let adjusted;
        let maxNumberOfUsers;

        this.users.subscribe(result => {
            maxNumberOfUsers = result.length;
        })

        if (user.check && this.selectedUsersCounter.getValue() <= maxNumberOfUsers - 1) {
            adjusted = this.selectedUsersCounter.getValue() + 1;
        } else if (!user.check) {
            adjusted = this.selectedUsersCounter.getValue() - 1;
        } else if (!flag && user.check) {
            // reset
            adjusted = 0;
        }
        this.selectedUsersCounter.next(adjusted);
        if (this.selectedUsersCounter.getValue() < 0) {
            // reset
            adjusted = 0;
        }
        return this.selectedUsersCounter.next(adjusted);
    }

}