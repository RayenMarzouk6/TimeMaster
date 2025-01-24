import 'package:flutter/material.dart';

class ContainerInfo extends StatelessWidget {
  final String titleContainer ;
  final String imageUrl ;

  const ContainerInfo({super.key, required this.titleContainer, required this.imageUrl});


  @override
  Widget build(BuildContext context) {
    return Stack(
            children: [
              
              Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: const Color(0xFF4169E1),
                  borderRadius: BorderRadius.circular(15),
                ),
                margin: EdgeInsets.symmetric(horizontal: 9),
                width: 420,
                height: 150,
              ),
              Positioned(
                right: 9,
                bottom: 0,
                child: Image.asset(imageUrl),
              ),
              Positioned(
                left: 20,
                top: 20,
                child: Row(
                  children: [
                    
                    Image.asset(
                    // "images/Login/login-logo.png",
                    "images/covers/loading-logo.png" ,
                    // "images/graphic-icons/university.png" ,
                      width: 50,
                      height: 90,
                    ),

                    SizedBox(width: 10),
                    Text(
                      titleContainer,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 25,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
  }
}