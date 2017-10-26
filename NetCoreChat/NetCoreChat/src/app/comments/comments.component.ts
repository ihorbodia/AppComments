import { Component, OnInit } from '@angular/core';
import { AuthService } from 'angular4-social-login';
import { SocialUser } from 'angular4-social-login';
import { AuthenticationService } from '../services/auth/auth.service';
import { Http } from '@angular/http';
import { UserComment } from './UserComment';
import { User } from '../login/User';
import { HubConnection } from '@aspnet/signalr-client/dist/src';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

    loggedUserName = '';

    private _hubConnection: HubConnection;
    public async: any;
    messages: string[] = [];

    private commentTitle: string;
    private commentText: string;
    private commentAutor: string;

    Comments: Array<UserComment> = new Array<UserComment>();
    control: any;

    constructor(private authService: AuthenticationService,
        private httpService: Http) {
        this.checkUser();
        this.authService.getLoggedInName.subscribe(name => this.changeName(name));
    }

    private changeName(name: string): void {
        this.loggedUserName = name;
    }

    ngOnInit() {
        this.httpService.get('/api/comments/GetAllComments').subscribe(values => {
            const jsonComments = values.json();
            for (let i = 0; i < values.json().length; i++) {
                this.Comments.push(
                    new UserComment(jsonComments[i].title, jsonComments[i].commentText, jsonComments[i].autor, jsonComments[i].postTime));
            }
            this.refreshComments();
        });

        this._hubConnection = new HubConnection('http://localhost:5000/commentsPublisher');
        this._hubConnection.on('Send', (newComment: any) => {
            this.Comments.push(
                new UserComment(newComment.title, newComment.commentText, newComment.autor, newComment.postTime));
                this.refreshComments();
        });

        this._hubConnection.start();

        this.control = document.getElementById('commentsShowArea');
    }

    refreshComments() {
        setTimeout(() => {
            this.control.scrollTop = this.control.scrollHeight;
        }, 1);
    }

    send() {
        this.checkUser();
        const comment = new UserComment(this.commentTitle, this.commentText, this.loggedUserName, Date.now());
        this._hubConnection.invoke('Send', comment);
    }

    private checkUser() {
        this.authService.checkUserName().subscribe(data => {
            if (data.text() === 'false') {
                this.authService.logout();
            } else {
                this.loggedUserName = this.authService.getLoggedUserName();
            }
        });
    }
}
