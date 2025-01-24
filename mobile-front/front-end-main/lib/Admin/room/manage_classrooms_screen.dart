import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:timemastermobile_front/Admin/room/ajouter_room.dart';

class ManageClassroomsScreen extends StatefulWidget {
  const ManageClassroomsScreen({super.key});

  @override
  State<ManageClassroomsScreen> createState() => _ManageClassroomsScreenState();
}

class _ManageClassroomsScreenState extends State<ManageClassroomsScreen> {
  List<Map<String, dynamic>> _classrooms = [];

  @override
  void initState() {
    super.initState();
    _fetchClassrooms();
  }

  Future<void> _fetchClassrooms() async {
    final response = await http.get(Uri.parse('http://localhost:3000/classrooms'));
    if (response.statusCode == 200) {
      setState(() {
        _classrooms = List<Map<String, dynamic>>.from(json.decode(response.body));
      });
    } else {
      throw Exception('Failed to load classrooms');
    }
  }

  Future<void> _deleteClassroom(int id) async {
    final response = await http.delete(
      Uri.parse('http://localhost:3000/classrooms/$id'),
    );

    if (response.statusCode == 200) {
      _fetchClassrooms(); // Refresh the list after deletion
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Classroom deleted successfully!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to delete classroom')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Manage Classrooms'),
        backgroundColor: const Color.fromRGBO(65, 105, 225, 1),
      ),
      body: _classrooms.isEmpty
          ? Center(
              child: Text(
                'No classrooms available.',
                style: TextStyle(fontSize: 18),
              ),
            )
          : ListView.builder(
              itemCount: _classrooms.length,
              itemBuilder: (context, index) {
                final classroom = _classrooms[index];
                return ListTile(
                  title: Text(classroom['name']),
                  trailing: IconButton(
                    icon: Icon(Icons.delete, color: Colors.red),
                    onPressed: () {
                      _deleteClassroom(classroom['id']);
                    },
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navigate to the Add Classroom screen
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const AjouterRoom(),
            ),
          );
        },
        child: Icon(Icons.add),
      ),
    );
  }
}