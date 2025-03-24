import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MaterialModule } from '@shared/material.module';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MaterialModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
