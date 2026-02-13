import { Component, OnInit, DoCheck, HostListener } from '@angular/core';
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
export class App implements OnInit, DoCheck {
  public title;
  public identity: any;
  public hasIdentity: boolean;
  public isUserMenuOpen: boolean;

  constructor(
    private _userService: UserService,
  ) {
    this.title = "NGSOCIAL";
    this.hasIdentity = false;
    this.isUserMenuOpen = false;

  }

  ngOnInit(): void {
    this.identity = this._userService.getIdentity();
    this.hasIdentity = this.hasValidIdentity(this.identity);
    console.log(this.identity);
  }

  ngDoCheck(): void {
    this.identity = this._userService.getIdentity();
    this.hasIdentity = this.hasValidIdentity(this.identity);

  }

  toggleUserMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  @HostListener('document:click')
  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  private hasValidIdentity(identity: any): boolean {
    if (!identity) {
      return false;
    }

    return !!(identity._id || identity.id || identity.email);
  }
}
