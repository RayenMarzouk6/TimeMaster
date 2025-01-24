import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEstablishmentsComponent } from './admin-establishments.component';

describe('AdminEstablishmentsComponent', () => {
  let component: AdminEstablishmentsComponent;
  let fixture: ComponentFixture<AdminEstablishmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminEstablishmentsComponent]
    });
    fixture = TestBed.createComponent(AdminEstablishmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
