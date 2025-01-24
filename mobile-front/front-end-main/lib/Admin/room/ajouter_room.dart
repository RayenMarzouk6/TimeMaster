import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:timemastermobile_front/widgets/container_info.dart';
import 'manage_classrooms_screen.dart'; // Import the ManageClassroomsScreen

class AjouterRoom extends StatefulWidget {
  const AjouterRoom({super.key});

  @override
  State<AjouterRoom> createState() => _AjouterRoomState();
}

class _AjouterRoomState extends State<AjouterRoom> {
  final _formKey = GlobalKey<FormState>();
  final _classroomNameController = TextEditingController();
  List<Map<String, dynamic>> _subjects = [];
  List<int> _selectedSubjectIds = [];

  @override
  void initState() {
    super.initState();
    _fetchSubjects();
  }

  Future<void> _fetchSubjects() async {
    final response = await http.get(Uri.parse('http://localhost:3000/subjects'));
    if (response.statusCode == 200) {
      setState(() {
        _subjects = List<Map<String, dynamic>>.from(json.decode(response.body));
      });
    } else {
      throw Exception('Failed to load subjects');
    }
  }

  Future<void> _addClassroom() async {
    if (_formKey.currentState!.validate()) {
      final classroomName = _classroomNameController.text;

      // Step 1: Add the classroom
      final classroomResponse = await http.post(
        Uri.parse('http://localhost:3000/classrooms'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'name': classroomName}),
      );

      if (classroomResponse.statusCode == 201) {
        final classroomId = json.decode(classroomResponse.body)['id'];

        // Step 2: Associate subjects with the classroom
        for (var subjectId in _selectedSubjectIds) {
          await http.post(
            Uri.parse('http://localhost:3000/classrooms/$classroomId/subjects/$subjectId'),
          );
        }

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Classroom and subjects added successfully!')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to add classroom')),
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
              SizedBox(height: 15),
              const ContainerInfo(
                titleContainer: "Ajouter un classrooms",
                imageUrl: "images/graphic-icons/room.png",
              ),
              SizedBox(height: 25),
              const SizedBox(height: 20),
              Text(
                "Ajouter une Classroom",
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue[800],
                ),
              ),
              const SizedBox(height: 30),
              TextFormField(
                controller: _classroomNameController,
                decoration: InputDecoration(
                  labelText: "Nom de la classroom",
                  prefixIcon: const Icon(Icons.meeting_room),
                  filled: true,
                  fillColor: Colors.grey[200],
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide.none,
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a classroom name';
                  }
                  return null;
                },
              ),
              SizedBox(height: 20),
              Text(
                'Select Subjects:',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.blue[800],
                ),
              ),
              ..._subjects.map((subject) {
                return CheckboxListTile(
                  title: Text(subject['name']),
                  value: _selectedSubjectIds.contains(subject['id']),
                  onChanged: (bool? value) {
                    setState(() {
                      if (value == true) {
                        _selectedSubjectIds.add(subject['id']);
                      } else {
                        _selectedSubjectIds.remove(subject['id']);
                      }
                    });
                  },
                );
              }).toList(),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _addClassroom,
                child: Text('Add Classroom'),
                style: ButtonStyle(
                  backgroundColor: MaterialStateProperty.all(const Color(0xFF4169E1)),
                  foregroundColor: MaterialStateProperty.all(Colors.white),
                  padding: MaterialStateProperty.all(
                    const EdgeInsets.symmetric(horizontal: 90, vertical: 25),
                  ),
                  shape: MaterialStateProperty.all(
                    RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(9),
                    ),
                  ),
                ),
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
              builder: (context) => const ManageClassroomsScreen(),
            ),
          );
        },
        child: const Icon(Icons.edit_note_sharp, color: Colors.white, size: 28),
      ),
    );
  }
}