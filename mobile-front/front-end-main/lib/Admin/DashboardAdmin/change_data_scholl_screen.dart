import 'package:flutter/material.dart';
import 'package:timemastermobile_front/Admin/school_managment/addSchool/add_name_school_screen.dart';
import 'package:timemastermobile_front/Admin/school_managment/addTime/choise_param.dart';
import 'package:timemastermobile_front/widgets/cover.dart';
import 'package:timemastermobile_front/Admin/DashboardAdmin/drawer_admin.dart';

import '../../widgets/choise_card_data_scholl.dart';


class ChangeDataSchollScreen extends StatelessWidget {
  const ChangeDataSchollScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return  Scaffold(
        appBar: AppBar(
          title: Image.asset("images/logos/appbar-logo.png"),
          ),
       
        drawer:  const DrawerPopup() ,

        body: Column(
          children: [
            const Cover(imagePath:"images/covers/cover2.png") ,
            const Text("Choose your option" , 
            style: TextStyle(
              color: Color.fromRGBO(17, 55, 171, 1),
              fontSize: 25,
              fontWeight: FontWeight.bold
            ),
            ) ,

            const SizedBox(width: 50,) ,

            
            Expanded( // Wrap GridView with Expanded
              child: GridView(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                ),

                children: const [

                    ChoiseCardDataScholl(imageUrl: "images/graphic-icons/university.png", text: "Information establishment" , route: AddNameCollageScreen(), ),
                    ChoiseCardDataScholl(imageUrl: "images/graphic-icons/jour-heurs.png", text: "Days and Hours" , route: ChoiseParam()),   

                ],
              ),
            ),



          ],
        ),
       
      );
  }
}