import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MaterialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() appTitle: string = 'GoRest Users Management';

  openApiDocs(): void {
    window.open('https://gorest.co.in/', '_blank', 'noopener, noreferrer');
  }
}
