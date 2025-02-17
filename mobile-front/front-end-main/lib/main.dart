import 'package:flutter/material.dart';
import 'package:timemastermobile_front/Admin/classe/add_classe_screen.dart';
import 'package:timemastermobile_front/Admin/room/ajouter_room.dart';
import 'package:timemastermobile_front/Admin/schedules/show_timetable_screen.dart';
import 'package:timemastermobile_front/Admin/school_managment/addTime/choise_param.dart';
import 'package:timemastermobile_front/Admin/student/add_student_screen.dart';
import 'package:timemastermobile_front/Admin/teacher/add_teacher_screen.dart';
import 'package:timemastermobile_front/Admin/teacher/manage_teachers_screen.dart';
import 'package:timemastermobile_front/Authentification/checkEmailPage.dart';
import 'package:timemastermobile_front/Authentification/loginPage.dart';
import 'package:timemastermobile_front/Admin/school_managment/addSchool/School_list_screen.dart';
import 'package:timemastermobile_front/Admin/school_managment/addSchool/add_name_school_screen.dart';
import 'package:timemastermobile_front/Admin/DashboardAdmin/change_data_scholl_screen.dart';
import 'package:timemastermobile_front/Admin/DashboardAdmin/dashbord_page_screen.dart';
import 'package:timemastermobile_front/Admin/DashboardAdmin/tabs_screen.dart';
import 'package:timemastermobile_front/Authentification/signupPage.dart';
import 'package:timemastermobile_front/Splash%20Screen/slash_screen.dart';
import 'package:timemastermobile_front/User/Screen/dashboardUser.dart';
import 'package:timemastermobile_front/User/Screen/discussion.dart';
import 'package:timemastermobile_front/User/Screen/time_table_screen.dart';
import 'package:timemastermobile_front/Admin/matiere/ajoutmatiere.dart';
import 'package:timemastermobile_front/Admin/school_managment/addSchool/update_school_screen.dart';
import 'package:timemastermobile_front/Admin/school_managment/data/school_model.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: "Time Master",
      theme: ThemeData(
        primaryColor: const Color.fromRGBO(65, 105, 225, 1),
        colorScheme: ColorScheme.fromSwatch().copyWith(
          secondary: const Color.fromRGBO(183, 28, 28, 1),
        ),
        brightness: Brightness.light,
        appBarTheme: const AppBarTheme(
          color: Color.fromRGBO(65, 105, 225, 1),
          elevation: 4,
          centerTitle: true,
        ),
      ),
      initialRoute: '/',
      onGenerateRoute: (settings) {
        if (settings.name == '/updateSchool') {
          final school = settings.arguments as School;
          return MaterialPageRoute(
            builder: (context) => UpdateSchoolScreen(school: school),
          );
        }
        // Ajoutez d'autres routes avec paramètres ici si nécessaire.
        return null;
      },
      routes: {
        
        

        '/': (context) => const SlashScreen(),
        // '/': (context) => const DashboardUser(),
        '/checkemail': (context) => const Checkemailpage(),
        '/addclasse': (context) => AddClasseScreen(),
        // '/addroom': (context) => const AddRoomScreen(),
        '/addroom': (context) => AjouterRoom(),
        '/addstudent': (context) => const AddStudentScreen(),
        '/addteacher': (context) => const AddTeacherScreen(),
        '/dashboardUser': (context) => const DashboardUser(),
        '/tabBar': (context) => const TabBarScreen(),
        '/dashboard': (context) => const DashbordPageScreen(),
        // '/schedule': (context) => const ScheduleScreen(),
        '/login': (context) => LoginPage(),
        '/changeDataSchool': (context) => const ChangeDataSchollScreen(),
        '/matieres': (context) => AjoutMatiereScreen(),
        '/addNameSchool': (context) => const AddNameCollageScreen(),
        '/listSchoolName': (context) => SchoolListScreen(),
        '/timetable': (context) => TimetableScreen(),
        '/discussion': (context) => DiscussionScreen(),
        '/choiseParam': (context) => ChoiseParam(),
        '/signup': (context) => const Signuppage(),
        '/listTeachers': (context) => const ManageTeachersScreen(),

      },
    );
  }
}
