import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ManageTeachersScreen extends StatefulWidget {
  const ManageTeachersScreen({Key? key}) : super(key: key);

  @override
  _ManageTeachersScreenState createState() => _ManageTeachersScreenState();
}

class _ManageTeachersScreenState extends State<ManageTeachersScreen> {
  List<Map<String, dynamic>> _teachers = [];

  @override
  void initState() {
    super.initState();
    _fetchTeachers();
  }

  // Fetch teachers from the backend
  Future<void> _fetchTeachers() async {
    try {
      final response = await http.get(Uri.parse('http://localhost:3000/teachers')); // Update with your teachers endpoint
      if (response.statusCode == 200) {
        setState(() {
          _teachers = List<Map<String, dynamic>>.from(json.decode(response.body));
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load teachers')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  // Delete a teacher by ID
  Future<void> _deleteTeacher(int id) async {
    try {
      final response = await http.delete(
        Uri.parse('http://localhost:3000/teachers/$id'), // Update with your delete endpoint
      );
      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Teacher deleted successfully!')),
        );
        _fetchTeachers(); // Refresh the list after deletion
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to delete teacher')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
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
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: _teachers.isEmpty
            ? const Center(
                child: Text(
                  'No teachers found.',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 18,
                  ),
                ),
              )
            : ListView.builder(
                itemCount: _teachers.length,
                itemBuilder: (context, index) {
                  final teacher = _teachers[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    elevation: 3,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: ListTile(
                      title: Text(
                        teacher['name'],
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      subtitle: Text(
                        'Subjects: ${teacher['subjects'].join(', ')}', // Display subjects
                        style: TextStyle(
                          color: Colors.grey[600],
                        ),
                      ),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red),
                        onPressed: () {
                          _deleteTeacher(teacher['id']);
                        },
                      ),
                      onTap: () {
                        // Navigate to edit screen (optional)
                        // Navigator.push(
                        //   context,
                        //   MaterialPageRoute(
                        //     builder: (context) => EditTeacherScreen(teacher: teacher),
                        //   ),
                        // );
                      },
                    ),
                  );
                },
              ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF7B7E81),
        tooltip: 'Add Teacher',
        onPressed: () {
          // Navigate back to the AddTeacherScreen
          Navigator.pop(context);
        },
        child: const Icon(Icons.add, color: Colors.white, size: 28),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endDocked,
    );
  }
}