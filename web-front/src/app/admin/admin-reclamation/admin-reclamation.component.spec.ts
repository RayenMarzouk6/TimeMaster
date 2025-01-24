import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReclamationComponent } from './admin-reclamation.component';

describe('AdminReclamationComponent', () => {
  let component: AdminReclamationComponent;
  let fixture: ComponentFixture<AdminReclamationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminReclamationComponent]
    });
    fixture = TestBed.createComponent(AdminReclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
