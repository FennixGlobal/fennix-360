import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-login',
    styleUrls: ['./app-auth-login.component.scss'],
    templateUrl: 'app-auth-login.component.html'
})
export class AppAuthLoginComponent {
    dynamicForm:FormGroup;

    constructor() {
        const group = {
            username:new FormControl(null),
            password:new FormControl(null)
        };
        this.dynamicForm = new FormGroup(group);
    }
    login($event){
        console.log($event);
    }

}