import 'package:flutter/material.dart';
import 'package:timemastermobile_front/Admin/student/manage_students_screen.dart';
import 'package:timemastermobile_front/Admin/student/student_service.dart';
import 'package:timemastermobile_front/widgets/container_info.dart';

class AddStudentScreen extends StatefulWidget {
  const AddStudentScreen({super.key});

  @override
  State<AddStudentScreen> createState() => _AddStudentScreenState();
}

class _AddStudentScreenState extends State<AddStudentScreen> {
  final TextEditingController _nameController = TextEditingController();
  final StudentService _studentService = StudentService();
  List<Map<String, dynamic>> _classes = [];
  int? _selectedClassId;

  @override
  void initState() {
    super.initState();
    _fetchClasses();
  }

  Future<void> _fetchClasses() async {
    final classes = await _studentService.fetchClasses();
    setState(() {
      _classes = classes;
    });
  }

  void _addStudent() async {
    final String name = _nameController.text;

    if (name.isNotEmpty && _selectedClassId != null) {
      print('Sending request with name: $name and classId: $_selectedClassId'); // Debug log
      try {
        bool success = await _studentService.addStudent(name, _selectedClassId!);
        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text('Student added successfully'),
          ));
          // Clear the form after successful submission
          _nameController.clear();
          setState(() {
            _selectedClassId = null;
          });
        } else {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text('Failed to add student'),
          ));
        }
      } catch (e) {
        print('Error: $e'); // Debug log
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Error: $e'),
        ));
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Please enter valid data'),
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Image.asset("images/logos/appbar-logo.png"),
        backgroundColor: const Color.fromRGBO(65, 105, 225, 1),
      ),
      body: Column(
        children: [
          SizedBox(height: 35),
          const ContainerInfo(
            titleContainer: "Ajouter un étudiant",
            imageUrl: "images/graphic-icons/student.png",
          ),
          SizedBox(height: 90),
          Text(
            "Saisir le nom de l’étudiant",
            style: TextStyle(
              color: Colors.blue[800],
              fontWeight: FontWeight.bold,
              fontSize: 16.5,
            ),
          ),
          SizedBox(height: 25),
          Container(
            padding: EdgeInsets.all(9),
            margin: EdgeInsets.symmetric(horizontal: 50, vertical: 10),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(9),
            ),
            child: TextField(
              controller: _nameController,
              keyboardType: TextInputType.text,
              textInputAction: TextInputAction.done,
              decoration: InputDecoration(
                hintText: "Ajouter le nom de l’étudiant",
                labelText: "name",
                prefixIcon: Icon(Icons.person_add_alt),
                filled: true,
                fillColor: Colors.grey[200],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
          Container(
            padding: EdgeInsets.all(9),
            margin: EdgeInsets.symmetric(horizontal: 50, vertical: 10),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(9),
            ),
            child: DropdownButtonFormField<int>(
              value: _selectedClassId,
              decoration: InputDecoration(
                hintText: "Sélectionner une classe",
                labelText: "Classe",
                prefixIcon: Icon(Icons.school),
                filled: true,
                fillColor: Colors.grey[200],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide.none,
                ),
              ),
              items: _classes.map((classe) {
                return DropdownMenuItem<int>(
                  value: classe['id'],
                  child: Text(classe['name']),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedClassId = value;
                });
              },
              validator: (value) {
                if (value == null) {
                  return 'Please select a class';
                }
                return null;
              },
            ),
          ),
          ElevatedButton(
            onPressed: _addStudent,
            style: ButtonStyle(
              backgroundColor: MaterialStateProperty.all(const Color(0xFF4169E1)),
              foregroundColor: MaterialStateProperty.all(Colors.white),
              padding: MaterialStateProperty.all(
                EdgeInsets.symmetric(horizontal: 165, vertical: 20),
              ),
              shape: MaterialStateProperty.all(
                RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(9),
                ),
              ),
            ),
            child: Text("Ajouter"),
          ),
        ],
      ),
  floatingActionButton: FloatingActionButton(
  onPressed: () {
    // Navigate to the ManageStudentsScreen
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const ManageStudentsScreen(),
      ),
    );
  },
  child: const Icon(Icons.list),
  backgroundColor: const Color.fromRGBO(65, 105, 225, 1),
),
floatingActionButtonLocation: FloatingActionButtonLocation.endDocked,
    );
  }
}