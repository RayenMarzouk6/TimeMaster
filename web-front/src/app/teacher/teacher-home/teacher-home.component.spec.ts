import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherHomeComponent } from './teacher-home.component';

describe('TeacherHomeComponent', () => {
  let component: TeacherHomeComponent;
  let fixture: ComponentFixture<TeacherHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherHomeComponent]
    });
    fixture = TestBed.createComponent(TeacherHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
