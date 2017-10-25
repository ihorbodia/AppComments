import { AuthenticationService } from '../services/auth/auth.service';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
    Component, Directive, forwardRef,
    Attribute, OnChanges, SimpleChanges, Input, OnInit
} from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    private userName: string;
    private password: string;

    constructor(private authService: AuthenticationService, private router: Router) {
    }

    ngOnInit() {
    }

    loginUser() {
        this.authService.login(this.userName, this.password);
    }

    signInWithFB() {
        console.log("fb");
        this.authService.loginWithFBOnServer();
    }
}
