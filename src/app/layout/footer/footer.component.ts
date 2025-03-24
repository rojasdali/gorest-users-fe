import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MaterialModule } from '@shared/material.module';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
