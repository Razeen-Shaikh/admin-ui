import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminComponent } from './admin.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  const mockUsers = [
    { id: 1, name: 'User 1', email: 'user1@example.com', role: 'Admin' },
    { id: 2, name: 'User 2', email: 'user2@example.com', role: 'Member' },
    { id: 3, name: 'User 3', email: 'user3@example.com', role: 'Member' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [HttpClientTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display search input with placeholder starting with "Search"', () => {
    const searchInput = fixture.debugElement.query(
      By.css('#searchInput')
    ).nativeElement;
    expect(searchInput.placeholder.startsWith('Search')).toBe(true);
  });

  it('should have a search icon/button with class "search-icon"', () => {
    const searchButton = fixture.debugElement.query(
      By.css('.search-icon')
    ).nativeElement;
    expect(searchButton).toBeTruthy();
  });

  it('should have one button for each action with correct class names', () => {
    const editButton = fixture.debugElement.query(By.css('.edit-button'));
    const deleteButton = fixture.debugElement.query(By.css('.delete-button'));
    const saveButton = fixture.debugElement.query(By.css('.save-button'));
    const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));

    expectButtonWithClass(editButton, 'edit-button');
    expectButtonWithClass(deleteButton, 'delete-button');
    expectButtonWithClass(saveButton, 'save-button');
    expectButtonWithClass(cancelButton, 'cancel-button');
  });

  function expectButtonWithClass(button: any, expectedClassName: string) {
    expect(button).toBeTruthy();

    const buttonElement = button.nativeElement;
    expect(buttonElement.tagName.toLowerCase()).toBe('button');
    expect(buttonElement.classList.contains(expectedClassName)).toBe(true);
  }
});
