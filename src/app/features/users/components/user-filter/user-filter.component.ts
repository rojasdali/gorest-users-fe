import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

export type UserStatus = 'all' | 'active' | 'inactive';
export type UserGender = 'all' | 'male' | 'female';

export interface UserFilter {
  searchTerm: string;
  status: UserStatus;
  gender: UserGender;
}

export const USER_STATUSES: UserStatus[] = ['all', 'active', 'inactive'];
export const USER_GENDERS: UserGender[] = ['all', 'male', 'female'];

export function isValidUserStatus(status: string): status is UserStatus {
  return USER_STATUSES.includes(status as UserStatus);
}

export function isValidUserGender(gender: string): gender is UserGender {
  return USER_GENDERS.includes(gender as UserGender);
}

export function toSafeUserStatus(status: string): UserStatus {
  return isValidUserStatus(status) ? status : 'all';
}

export function toSafeUserGender(gender: string): UserGender {
  return isValidUserGender(gender) ? gender : 'all';
}

@Component({
  selector: 'app-user-filter',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.scss',
})
export class UserFilterComponent implements OnInit, OnDestroy {
  @Input() initialFilter: UserFilter = {
    searchTerm: '',
    status: 'all',
    gender: 'all',
  };

  @Output() filterChange = new EventEmitter<UserFilter>();

  filterForm!: FormGroup;
  private formSubscription?: Subscription;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      searchTerm: [this.initialFilter.searchTerm],
      status: [this.initialFilter.status],
      gender: [this.initialFilter.gender],
    });

    this.formSubscription = this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe((values) => {
        this.filterChange.emit(values as UserFilter);
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
      status: 'all' as UserStatus,
      gender: 'all' as UserGender,
    });
  }

  search(event: Event): void {
    event.preventDefault();
  }
}
