import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  providers: [UserService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public title;
  public identity: any;
  public hasIdentity: boolean;

  constructor(
    private _userService: UserService,
  ) {
    this.title = "NGSOCIAL";
    this.hasIdentity = false;

  }

  ngOnInit(): void {
    this.identity = this._userService.getIdentity();
    this.hasIdentity = !!this.identity && !!this.identity._id;
    console.log(this.identity);
  }
}
