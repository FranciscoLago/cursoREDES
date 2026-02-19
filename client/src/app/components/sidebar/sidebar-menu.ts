import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-sidebar-menu',
    templateUrl: './sidebar-menu.html',
    styleUrls: ['./sidebar-menu.css'],
    standalone: true,
    imports: [RouterLink, RouterLinkActive]
})
export class SidebarMenuComponent { }
