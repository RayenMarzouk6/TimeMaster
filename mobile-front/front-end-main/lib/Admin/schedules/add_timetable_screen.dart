import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:timemastermobile_front/Admin/schedules/show_timetable_screen.dart';



class AddTimetableScreen extends StatefulWidget {
  const AddTimetableScreen({super.key});

  @override
  _AddTimetableScreenState createState() => _AddTimetableScreenState();
}

class _AddTimetableScreenState extends State<AddTimetableScreen> {
  final _formKey = GlobalKey<FormState>();
  final List<Map<String, dynamic>> _timetableData = [];

  // Dropdown data
  List<String> _teachers = [];
  List<String> _subjects = [];
  List<String> _classes = [];
  final List<String> _durations = ['1h', '2h', '3h'];

  // Selected values
  String? _selectedTeacher;
  String? _selectedSubject;
  String? _selectedClass;
  String? _selectedDuration;

  @override
  void initState() {
    super.initState();
    _fetchDropdownData();
  }

 Future<void> _fetchDropdownData() async {
  try {
    // Fetch teachers
    final teachersResponse = await http.get(Uri.parse('http://localhost:3000/teachers'));
    if (teachersResponse.statusCode == 200) {
      final teachersData = json.decode(teachersResponse.body) as List;
      setState(() {
        _teachers = teachersData.map<String>((teacher) => teacher['name'].toString()).toList();
      });
    } else {
      throw Exception('Failed to load teachers');
    }

    // Fetch subjects
    final subjectsResponse = await http.get(Uri.parse('http://localhost:3000/subjects'));
    if (subjectsResponse.statusCode == 200) {
      final subjectsData = json.decode(subjectsResponse.body) as List;
      setState(() {
        _subjects = subjectsData.map<String>((subject) => subject['name'].toString()).toList();
      });
    } else {
      throw Exception('Failed to load subjects');
    }

    // Fetch classes
    final classesResponse = await http.get(Uri.parse('http://localhost:3000/classes'));
    if (classesResponse.statusCode == 200) {
      final classesData = json.decode(classesResponse.body) as List;
      setState(() {
        _classes = classesData.map<String>((classEntity) => classEntity['name'].toString()).toList();
      });
    } else {
      throw Exception('Failed to load classes');
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Error fetching data: $e')),
    );
  }
}

  void _addTimetableEntry() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _timetableData.add({
          'teacherName': _selectedTeacher,
          'subjectName': _selectedSubject,
          'className': _selectedClass,
          'duration': _selectedDuration,
        });
        _selectedTeacher = null;
        _selectedSubject = null;
        _selectedClass = null;
        _selectedDuration = null;
      });
    }
  }

  Future<void> _submitTimetable() async {
  if (_timetableData.isEmpty) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Please add at least one timetable entry.')),
    );
    return;
  }

  final response = await http.post(
    Uri.parse('http://localhost:3000/schedule'),
    headers: {'Content-Type': 'application/json'},
    body: json.encode(_timetableData),
  );

  if (response.statusCode == 201) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Timetable generated successfully!')),
    );
    // Navigate to the TimetableScreen to display the result
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ShowTimetableScreen(),
      ),
    );
  } else {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Failed to generate timetable: ${response.body}')),
    );
  }
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Timetable'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              DropdownButtonFormField<String>(
                value: _selectedTeacher,
                decoration: const InputDecoration(labelText: 'Teacher'),
                items: _teachers.map((teacher) {
                  return DropdownMenuItem(
                    value: teacher,
                    child: Text(teacher),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedTeacher = value;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select a teacher';
                  }
                  return null;
                },
              ),
              DropdownButtonFormField<String>(
                value: _selectedSubject,
                decoration: const InputDecoration(labelText: 'Subject'),
                items: _subjects.map((subject) {
                  return DropdownMenuItem(
                    value: subject,
                    child: Text(subject),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedSubject = value;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select a subject';
                  }
                  return null;
                },
              ),
              DropdownButtonFormField<String>(
                value: _selectedClass,
                decoration: const InputDecoration(labelText: 'Class'),
                items: _classes.map((classEntity) {
                  return DropdownMenuItem(
                    value: classEntity,
                    child: Text(classEntity),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedClass = value;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select a class';
                  }
                  return null;
                },
              ),
              DropdownButtonFormField<String>(
                value: _selectedDuration,
                decoration: const InputDecoration(labelText: 'Duration'),
                items: _durations.map((duration) {
                  return DropdownMenuItem(
                    value: duration,
                    child: Text(duration),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedDuration = value;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select a duration';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _addTimetableEntry,
                child: const Text('Add Entry'),
              ),
              const SizedBox(height: 20),
              Expanded(
                child: ListView.builder(
                  itemCount: _timetableData.length,
                  itemBuilder: (context, index) {
                    final entry = _timetableData[index];
                    return ListTile(
                      title: Text('Teacher: ${entry['teacherName']}'),
                      subtitle: Text('Subject: ${entry['subjectName']}, Class: ${entry['className']}, Duration: ${entry['duration']}'),
                    );
                  },
                ),
              ),
              ElevatedButton(
                onPressed: _submitTimetable,
                child: const Text('Generate Timetable'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}