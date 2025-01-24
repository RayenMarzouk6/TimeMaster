import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:timemastermobile_front/User/Screen/discussion.dart';
import 'package:timemastermobile_front/User/Screen/table_screen.dart';
import 'package:timemastermobile_front/User/Screen/time_table_screen.dart';
import 'package:timemastermobile_front/User/widget/card_dashboarduser.dart';
import 'package:timemastermobile_front/User/Screen/drawer_user.dart';

class DashboardUser extends StatefulWidget {
  const DashboardUser({Key? key}) : super(key: key);

  @override
  _DashboardUserState createState() => _DashboardUserState();
}

class _DashboardUserState extends State<DashboardUser> {
  final _storage = const FlutterSecureStorage();
  String? _userName;
  String? _email;

  @override
  void initState() {
    super.initState();
    _fetchUserData();
  }

Future<void> _fetchUserData() async {
  try {
    // Retrieve the token from secure storage
    final token = await _storage.read(key: 'auth_token');

    if (token == null) {
      throw Exception("User is not logged in.");
    }

    // Send a GET request to fetch user data
    final response = await http.get(
      Uri.parse('http://localhost:3000/users/profile'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      // Debugging: Print the API response
      print('API Response: $data');

      // Extract the username and email from the response
      setState(() {
        _userName = data['username'] ?? "No User name"; // Adjust based on your API response
        _email = data['email'] ?? "No Email";
      });
    } else {
      throw Exception('Failed to fetch user data. Status: ${response.statusCode}');
    }
  } catch (e) {
    setState(() {
      _userName = "👋🏼";
      _email = "";
    });
    print('Error fetching user data: $e');
  }
}

  Future<void> _logout() async {
    await _storage.delete(key: 'auth_token'); // Suppression du token
    Navigator.pushReplacementNamed(context, '/login'); // Redirection vers la page de connexion
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = const Color(0xFF4169E1);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: primaryColor,
        title: Image.asset(
          "images/logos/appbar-logo.png",
          height: 40,
        ),
        centerTitle: true,
        elevation: 0,
      ),
      drawer: DrawerUser(
        username: _userName ?? "Loading...",
        email: _email ?? "Loading...",
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Section d'accueil
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                RichText(
                  text: TextSpan(
                    children: [
                      const TextSpan(
                        text: "Welcome ",
                        style: TextStyle(
                          color: Color.fromARGB(255, 4, 44, 242),
                          fontWeight: FontWeight.bold,
                          fontSize: 28,
                        ),
                      ),
                      TextSpan(
                        text: _userName ?? "Loading...",
                        style: const TextStyle(
                          color: Colors.black87,
                          fontWeight: FontWeight.bold,
                          fontSize: 28,
                        ),
                      ),
                    ],
                  ),
                ),
                // const CircleAvatar(
                //   radius: 30,
                //   backgroundImage: AssetImage('images/persons/user.png'),
                // ),
              ],
            ),
            const SizedBox(height: 30),

            // En-tête du tableau de bord avec un gradient
            Stack(
              alignment: Alignment.centerRight,
              children: [
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        primaryColor.withOpacity(0.7),
                        const Color.fromARGB(255, 4, 44, 242)
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: const Color.fromARGB(255, 255, 255, 255),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      "User Dashboard",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 26,
                      ),
                    ),
                  ),
                ),
                Positioned(
                  right: -10,
                  child: Image.asset(
                    "images/covers/right_dashbord.png",
                    width: 150,
                    height: 150,
                  ),
                ),
                Positioned(
                  left: -10,
                  child: Image.asset(
                    "images/covers/left_dashbord.png",
                    width: 150,
                    height: 150,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 40),

            // Cartes du tableau de bord
            CardDashboarduser(
              imageUrl: "images/covers/timetable.jpg",
              text: "Check Timetable",
              route: TableScreen(classId: 1,),
            ),
            CardDashboarduser(
              imageUrl: "images/covers/discussion.jpg",
              text: "Discussion of Results",
              route: DiscussionScreen (),
            ),
          ],
        ),
      ),
    );
  }
}
