import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:timemastermobile_front/Admin/classe/manage_classe_screen.dart';
import 'package:timemastermobile_front/Admin/room/manage_classrooms_screen.dart';
import 'dart:convert';

import 'package:timemastermobile_front/widgets/container_info.dart';

class AddClasseScreen extends StatefulWidget {
  @override
  _AddClasseScreenState createState() => _AddClasseScreenState();
}

class _AddClasseScreenState extends State<AddClasseScreen> {
  final _formKey = GlobalKey<FormState>();
  final _classNameController = TextEditingController();
  final _classLevelController = TextEditingController();

  Future<void> _addClass() async {
    if (_formKey.currentState!.validate()) {
      final className = _classNameController.text;
      final classLevel = _classLevelController.text;

      // Send the data to the backend
      final response = await http.post(
        Uri.parse('http://localhost:3000/classes'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'name': className, 'level': classLevel}),
      );

      if (response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Class added successfully!')),
        );

        // Clear the form
        _classNameController.clear();
        _classLevelController.clear();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to add class')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Image.asset("images/logos/appbar-logo.png"),
        backgroundColor: const Color.fromRGBO(65, 105, 225, 1),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              const SizedBox(height: 35),
            const ContainerInfo(
              titleContainer: "Ajouter une classe groupe",
              imageUrl: "images/graphic-icons/classe.png",
            ),

            const SizedBox(height: 90),
            Text(
              "Saisir le nom de la classe",
              style: TextStyle(
                color: Colors.blue[800],
                fontWeight: FontWeight.bold,
                fontSize: 16.5,
              ),
            ),
             const SizedBox(height: 15),


              TextFormField(
                controller: _classNameController,
                decoration: InputDecoration(
                labelText: "Nom de la classe",
                hintText: "EX : DSI3.1",
                prefixIcon: const Icon(Icons.class_),
                filled: true,
                fillColor: Colors.grey[200],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide.none,
                ),
              ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a class name';
                  }
                  return null;
                },
              ),

              SizedBox(height: 20,) ,

              TextFormField(
                controller: _classLevelController,
                decoration: InputDecoration(
                labelText: "Level",
                hintText: "EX : 2eme",
                prefixIcon: const Icon(Icons.class_),
                filled: true,
                fillColor: Colors.grey[200],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide.none,
                ),
              ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a class level';
                  }
                  return null;
                },
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _addClass,
                child: Text('Add Class'),
                style: ButtonStyle(
                  backgroundColor: MaterialStateProperty.all(
                      const Color(0xFF4169E1)),
                  foregroundColor: MaterialStateProperty.all(Colors.white),
                  padding: MaterialStateProperty.all(
                    const EdgeInsets.symmetric(horizontal: 100, vertical: 23),
                  ),
                  shape: MaterialStateProperty.all(
                    RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(9),
                    ),
                  ), ),
              ),
            ],
          ),
        ),
      ),
     floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF7B7E81),
        tooltip: 'Manage Classrooms',
        onPressed: () {
          // Navigate to the ManageClassroomsScreen
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const ManageClasseScreen(),
            ),
          );
        },
        child: const Icon(Icons.edit_note_sharp, color: Colors.white, size: 28),
      ),
    );
  }
}