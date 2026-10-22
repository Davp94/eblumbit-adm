import { Component, signal } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  imports: [Sidebar, Topbar, RouterOutlet, MatSidenavModule],
  selector: 'app-main-layout',
  styleUrl: './main-layout.css',
  templateUrl: './main-layout.html',
})
export class MainLayout {
  events = signal<('open!' | 'close!')[]>([]);
  opened = signal(false);

  trackEvent(event: 'open!' | 'close!') {
    this.events.update(events => [...events, event]);
  }
}
