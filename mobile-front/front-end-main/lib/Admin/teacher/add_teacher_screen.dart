import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:timemastermobile_front/Admin/teacher/teacher_service.dart';
import 'package:timemastermobile_front/widgets/container_info.dart';

class AddTeacherScreen extends StatefulWidget {
  const AddTeacherScreen({super.key});

  @override
  State<AddTeacherScreen> createState() => _AddTeacherScreenState();
}

class _AddTeacherScreenState extends State<AddTeacherScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TeacherService _teacherService = TeacherService(); // Initialize TeacherService
  List<Map<String, dynamic>> _subjects = []; // List of subjects from the backend
  List<int> _selectedSubjectIds = []; // IDs of selected subjects

  @override
  void initState() {
    super.initState();
    _fetchSubjects(); // Fetch subjects when the screen loads
  }

  // Fetch subjects from the backend
  Future<void> _fetchSubjects() async {
    try {
      final response = await http.get(Uri.parse("http://localhost:3000/subjects")); // Update with your subjects endpoint
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        setState(() {
          _subjects = data.map((subject) => {
            'id': subject['id'],
            'name': subject['name'],
          }).toList();
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Erreur lors de la récupération des matières.")),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Erreur réseau : $e")),
      );
    }
  }

  // Method to add a teacher by making a POST request
  Future<void> _addTeacher() async {
    final String teacherName = _nameController.text.trim();
    if (teacherName.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Le nom de l'enseignant est requis.")),
      );
      return;
    }

    if (_selectedSubjectIds.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Veuillez sélectionner au moins une matière.")),
      );
      return;
    }

    try {
      await _teacherService.addTeacher(teacherName, _selectedSubjectIds); // Pass teacher name and subject IDs
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Enseignant ajouté avec succès !")),
      );
      _nameController.clear(); // Clear the input field
      setState(() {
        _selectedSubjectIds = []; // Clear selected subjects
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Erreur lors de l'ajout de l'enseignant : $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Image.asset("images/logos/appbar-logo.png"),
        backgroundColor: const Color.fromRGBO(65, 105, 225, 1),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 35),
            const ContainerInfo(
              titleContainer: "Ajouter un enseignant",
              imageUrl: "images/graphic-icons/teacher.png",
            ),
            const SizedBox(height: 90),
            Text(
              "Saisir le nom de l’enseignant",
              style: TextStyle(
                color: Colors.blue[800],
                fontWeight: FontWeight.bold,
                fontSize: 16.5,
              ),
            ),
            const SizedBox(height: 25),
            Container(
              padding: const EdgeInsets.all(9),
              margin: const EdgeInsets.symmetric(horizontal: 50, vertical: 10),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(9),
              ),
              child: TextField(
                controller: _nameController,
                keyboardType: TextInputType.text,
                textInputAction: TextInputAction.done,
                decoration: InputDecoration(
                  hintText: "Ajouter le nom de l'enseignant",
                  labelText: "Nom",
                  prefixIcon: const Icon(Icons.person_pin_outlined),
                  filled: true,
                  fillColor: Colors.grey[200],
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              "Sélectionner les matières enseignées",
              style: TextStyle(
                color: Colors.blue[800],
                fontWeight: FontWeight.bold,
                fontSize: 16.5,
              ),
            ),
            const SizedBox(height: 10),
            // Multi-select dropdown for subjects
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 50),
              child: DropdownButtonFormField<int>(
                isExpanded: true,
                hint: const Text("Sélectionner les matières"),
                items: _subjects.map((subject) {
                  return DropdownMenuItem<int>(
                    value: subject['id'],
                    child: Text(subject['name']),
                  );
                }).toList(),
                onChanged: (value) {
                  if (value != null) {
                    setState(() {
                      if (!_selectedSubjectIds.contains(value)) {
                        _selectedSubjectIds.add(value);
                      }
                    });
                  }
                },
              ),
            ),
            const SizedBox(height: 20),
            // Display selected subjects
            Wrap(
              spacing: 8,
              children: _selectedSubjectIds.map((subjectId) {
                final subject = _subjects.firstWhere((s) => s['id'] == subjectId);
                return Chip(
                  label: Text(subject['name']),
                  onDeleted: () {
                    setState(() {
                      _selectedSubjectIds.remove(subjectId);
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _addTeacher,
              style: ButtonStyle(
                backgroundColor: MaterialStateProperty.all(const Color(0xFF4169E1)),
                foregroundColor: MaterialStateProperty.all(Colors.white),
                padding: MaterialStateProperty.all(
                  const EdgeInsets.symmetric(horizontal: 165, vertical: 20),
                ),
                shape: MaterialStateProperty.all(
                  RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(9),
                  ),
                ),
              ),
              child: const Text("Ajouter"),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navigate to another screen, e.g., a list of teachers
          Navigator.pushNamed(context, "/listTeachers");
        },
        child: const Icon(Icons.list),
        backgroundColor: const Color.fromRGBO(65, 105, 225, 1),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endDocked,
    );
  }
}