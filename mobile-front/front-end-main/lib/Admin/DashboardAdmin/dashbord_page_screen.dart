import 'package:flutter/material.dart';
import 'package:timemastermobile_front/Admin/DashboardAdmin/change_data_scholl_screen.dart';
import 'package:timemastermobile_front/Admin/DashboardAdmin/drawer_admin.dart';
import 'package:timemastermobile_front/Admin/classe/add_classe_screen.dart';
import 'package:timemastermobile_front/Admin/matiere/ajoutmatiere.dart';
import 'package:timemastermobile_front/Admin/room/ajouter_room.dart';
import 'package:timemastermobile_front/Admin/schedules/add_timetable_screen.dart';
import 'package:timemastermobile_front/Admin/school_managment/addTime/choise_param.dart';
import 'package:timemastermobile_front/Admin/student/add_student_screen.dart';
import 'package:timemastermobile_front/Admin/teacher/add_teacher_screen.dart';

import '../../widgets/choise_card.dart';
import '../../widgets/cover.dart';

class DashbordPageScreen extends StatelessWidget {
  const DashbordPageScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Cover(imagePath: "images/covers/home-cove-img.png"),
        const Text(
          "Choose your option",
          style: TextStyle(
              color: Color.fromRGBO(17, 55, 171, 1),
              fontSize: 25,
              fontWeight: FontWeight.bold),
        ),
        const SizedBox(
          width: 50,
        ),
        Expanded(
          // Wrap GridView with Expanded
          child: GridView(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
            ),
            children: [
              // const ChoiseCard(
              //     icon: Icons.business,
              //     title :"School Data" ,
              //     route: ChangeDataSchollScreen()),
              const ChoiseCard(
                  icon: Icons.access_time_filled,
                  title: "Schedule Data",
                  // route: ChoiseParam()),
                  route: AddTimetableScreen()),
              ChoiseCard(
                icon: Icons.menu_book_sharp,
                title: "Matter",
                route: AjoutMatiereScreen(),
              ),
              const ChoiseCard(
                  icon: Icons.manage_accounts,
                  title: "Student Data",
                  route: AddStudentScreen()),
              const ChoiseCard(
                  icon: Icons.person_pin_sharp,
                  title: "Teacher Data",
                  route: AddTeacherScreen()),
              ChoiseCard(
                icon: Icons.meeting_room,
                title: "Room Data",
                route: AjouterRoom(),
              ),
              ChoiseCard(
                icon: Icons.supervised_user_circle_rounded,
                title: "Group Data",
                route: AddClasseScreen(),
              ),
            ],
          ),
        ),
      ],
    );
  }
}