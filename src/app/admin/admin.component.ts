import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isEditing?: boolean;
  isSelected?: boolean;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass'],
})
export class AdminComponent {
  users: User[] = [];
  editingUser: User | null = null;
  filteredUsers: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];

  // Pagination settings
  pageSize: number = 10;
  totalPages: number = 0;
  itemsPerPage: number = 10;
  currentPage: number = 1;
  filterValue: string = '';
  isEditing: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    const apiUrl =
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

    this.http
      .get<any[]>(apiUrl)
      .pipe(catchError((error) => this.handleError(error)))
      .subscribe((data) => {
        this.users = data;
        this.applyFilter();
        this.calculateTotalPages();
      });
  }

  applyFilter(): void {
    this.currentPage = 1;
    this.updateFilteredUsers();
  }

  editUser(user: User): void {
    user.isEditing = true;
    this.isEditing = { ...user };
  }

  saveChanges(user: User): void {
    user.isEditing = false;
    this.isEditing = null;
    this.updateFilteredUsers();
  }

  cancelEdit(user: User): void {
    user.isEditing = false;
    if (this.isEditing !== null) {
      user.name = this.isEditing.name;
      user.email = this.isEditing.email;
      user.role = this.isEditing.role;
      this.isEditing = null;
    }
    this.updateFilteredUsers();
  }

  deleteUser(user: User): void {
    this.users = this.users.filter((u) => u.id !== user.id);
    this.applyFilter();
    this.calculateTotalPages();
  }

  toggleSelect(user: User): void {
    user.isSelected = !user.isSelected;
  }

  selectAll(event: any): void {
    this.filteredUsers.forEach(
      (user) => (user.isSelected = event.target.checked)
    );
  }

  deleteSelected(): void {
    this.users = this.users.filter((user) => !user.isSelected);
    this.updateFilteredUsers();
  }

  hasSelectedUsers(): boolean {
    return this.users.some((user) => user.isSelected);
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, totalPages);
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    const numPagesToShow = Math.ceil(this.users.length / this.itemsPerPage);
    const pageNumbers: number[] = [];

    let start = Math.max(1, this.currentPage - Math.floor(numPagesToShow / 2));
    let end = Math.min(totalPages, start + numPagesToShow - 1);

    start = Math.max(1, end - numPagesToShow + 1);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateFilteredUsers();
  }

  goToFirstPage(): void {
    this.currentPage = 1;
    this.updateFilteredUsers();
  }

  goToPreviousPage(): void {
    this.currentPage = Math.max(this.currentPage - 1, 1);
    this.updateFilteredUsers();
  }

  goToNextPage(): void {
    this.currentPage = Math.min(this.currentPage + 1, this.totalPages);
    console.log(this.currentPage);
    this.updateFilteredUsers();
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
    this.updateFilteredUsers();
  }

  private updateFilteredUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (this.filterValue.trim() !== '') {
      this.filteredUsers = this.users
        .filter((user) =>
          Object.values(user).some(
            (value) =>
              typeof value === 'string' &&
              value.toLowerCase().includes(this.filterValue.toLowerCase())
          )
        )
        .slice(startIndex, endIndex);
    } else {
      this.filteredUsers = this.users.slice(startIndex, endIndex);
    }
    this.updatePagination();
  }
  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.users.length / this.pageSize);
  }

  private handleError(error: any): Observable<never> {
    console.error('Error fetching users:', error);
    return new Observable<never>((observer) => {
      observer.error(error);
      observer.complete();
    });
  }
}
