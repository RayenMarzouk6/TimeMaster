import 'package:flutter/material.dart';
import 'package:timemastermobile_front/Authentification/loginPage.dart';

class Checkemailpage extends StatelessWidget {
  const Checkemailpage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4169E1),
      body: Stack(
        children: [
        Positioned(
          child: Image.asset("images/checkEmail/checkemail-top.png") ,
          top: 20,
          right: 100,
        ) ,
        Positioned(
          child: Expanded(
            flex: 5,
            child: Image.asset("images/checkEmail/checkemail-bottom.png" ,
            //  width: double.infinity,
             fit: BoxFit.fitHeight,
                     ),
          ) ,
           bottom: 0,
           right: 0,
          ) ,
        
        Center(  // Utiliser Center pour centrer le contenu
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(15),
              color: Colors.white,
            ),
            width: 400,
            height: 430,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,  // Centrer verticalement le contenu dans le container
              crossAxisAlignment: CrossAxisAlignment.center,  // Centrer horizontalement
              children: [
                const Text("Please check your mail !" ,
                 style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 25
                 ),
                ),
                SizedBox(height: 20,) ,
                Image.asset("images/checkEmail/checkemail-logo.png"),
                SizedBox(height: 90,) ,








                ElevatedButton(
                  onPressed: () => {
                    Navigator.pushNamed(context, '/login') 
                  },
                  style: ButtonStyle(
                    backgroundColor: MaterialStateProperty.all(const Color(0xFF4169E1)),
                    foregroundColor: MaterialStateProperty.all(Colors.white),
                    padding: MaterialStateProperty.all(
                      const EdgeInsets.symmetric(horizontal: 130, vertical: 25),
                    ),
                    shape: MaterialStateProperty.all(
                      RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(9),
                      ),
                    ),
                  ),
                  child: const Text('Go To Login'),
                ),












              ],
            ),
          ),
        ),
        ],
      ),
    );
  }
}
