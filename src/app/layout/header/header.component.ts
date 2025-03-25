import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { MaterialModule } from '@shared/material.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MaterialModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() appTitle: string = 'GoRest Users Management';
  username: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.authService.username$.subscribe((username) => {
      this.username = username;
    });
  }

  openApiDocs(): void {
    window.open('https://gorest.co.in/', '_blank', 'noopener, noreferrer');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToHome(): void {
    this.router.navigate(['/'], {
      queryParamsHandling: 'preserve',
    });
  }
}
