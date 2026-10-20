import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserSummary } from './components/user-summary/user-summary';
import { CardDetail } from './components/card-detail/card-detail';

@Component({
  imports: [RouterOutlet, UserSummary, CardDetail],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('eblumbit-adm');
}
