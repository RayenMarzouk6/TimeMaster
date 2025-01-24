import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import components
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

// Admin-related components
import { AdminStudentsComponent } from './admin/admin-students/admin-students.component';
import { AdminTeachersComponent } from './admin/admin-teachers/admin-teachers.component';
import { AdminEstablishmentsComponent } from './admin/admin-establishments/admin-establishments.component';
import { AdminClassroomsComponent } from './admin/admin-classrooms/admin-classrooms.component';
import { AdminClassComponent } from './admin/admin-class/admin-class.component';
import { AdminCourseComponent } from './admin/admin-course/admin-course.component';
import { UserHomeComponent } from './user/user-home/user-home.component';
import { TeacherHomeComponent } from './teacher/teacher-home/teacher-home.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AdminScheduleComponent } from './admin/admin-schedule/admin-schedule.component';
import { RegisterComponent } from './register/register.component';
import { CheckemailComponent } from './checkemail/checkemail.component';
import { AdminReclamationComponent } from './admin/admin-reclamation/admin-reclamation.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AuthGuard } from './services/authguard.service';

const routes: Routes = [
  // Routes non protégées
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'checkemail', component: CheckemailComponent },

  // Routes de l'utilisateur
  { path: 'user', component: UserHomeComponent, canActivate: [AuthGuard], data: { role: 'student' } },

  // Routes de l'enseignant
  { path: 'teacher', component: TeacherHomeComponent, canActivate: [AuthGuard], data: { role: 'teacher' } },

  // Routes de l'administrateur
  { path: 'admin/home', component: AdminHomeComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/students', component: AdminStudentsComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/teachers', component: AdminTeachersComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/establishments', component: AdminEstablishmentsComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/classrooms', component: AdminClassroomsComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/classes', component: AdminClassComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/courses', component: AdminCourseComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/schedule', component: AdminScheduleComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/reclamations', component: AdminReclamationComponent, canActivate: [AuthGuard], data: { role: 'admin' } }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
