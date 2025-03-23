import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

export interface UserFilter {
  searchTerm: string;
  status: 'all' | 'active' | 'inactive';
  gender: 'all' | 'male' | 'female';
}

@Component({
  selector: 'app-user-filter',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.scss',
})
export class UserFilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<UserFilter>();

  filterForm: FormGroup;
  private formSubscription?: Subscription;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      status: ['all'],
      gender: ['all'],
    });
  }

  ngOnInit(): void {
    this.formSubscription = this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe((filters) => {
        this.filterChange.emit(filters);
      });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  resetFilters(): void {
    this.filterForm.reset({
      searchTerm: '',
      status: 'all',
      gender: 'all',
    });
  }

  search(event: Event): void {
    event.preventDefault();
  }
}
