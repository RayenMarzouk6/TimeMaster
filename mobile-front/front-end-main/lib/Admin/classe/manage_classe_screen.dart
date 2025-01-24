import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ManageClasseScreen extends StatefulWidget {
  const ManageClasseScreen({Key? key}) : super(key: key);

  @override
  _ManageClasseScreenState createState() => _ManageClasseScreenState();
}

class _ManageClasseScreenState extends State<ManageClasseScreen> {
  List<dynamic> _classes = [];

  @override
  void initState() {
    super.initState();
    _fetchClasses();
  }

  Future<void> _fetchClasses() async {
    final response = await http.get(Uri.parse('http://localhost:3000/classes'));
    if (response.statusCode == 200) {
      setState(() {
        _classes = json.decode(response.body);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load classes')),
      );
    }
  }

  Future<void> _deleteClass(int id) async {
    final response = await http.delete(
      Uri.parse('http://localhost:3000/classes/$id'),
    );
    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Class deleted successfully!')),
      );
      _fetchClasses(); // Refresh the list after deletion
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to delete class')),
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
        child: _classes.isEmpty
            ? Center(
                child: Text(
                  'No classes found.',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 18,
                  ),
                ),
              )
            : ListView.builder(
                itemCount: _classes.length,
                itemBuilder: (context, index) {
                  final classe = _classes[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    elevation: 3,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: ListTile(
                      title: Text(
                        classe['name'],
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      subtitle: Text(
                        'Level: ${classe['level']}',
                        style: TextStyle(
                          color: Colors.grey[600],
                        ),
                      ),
                      trailing: IconButton(
                        icon: Icon(Icons.delete, color: Colors.red),
                        onPressed: () {
                          _deleteClass(classe['id']);
                        },
                      ),
                      onTap: () {
                        // Navigate to edit screen (optional)
                        // Navigator.push(
                        //   context,
                        //   MaterialPageRoute(
                        //     builder: (context) => EditClassScreen(classe: classe),
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
        tooltip: 'Add Class',
        onPressed: () {
          // Navigate back to the AddClassScreen
          Navigator.pop(context);
        },
        child: const Icon(Icons.add, color: Colors.white, size: 28),
      ),
    );
  }
}