import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class TimetableScreen extends StatefulWidget {
  const TimetableScreen({super.key});

  @override
  _TimetableScreenState createState() => _TimetableScreenState();
}

class _TimetableScreenState extends State<TimetableScreen> {
  List<dynamic> _timetableData = [];
  List<dynamic> _classes = [];
  bool _isLoading = true;
  String _errorMessage = '';
  String? _selectedClass;

  @override
  void initState() {
    super.initState();
    _fetchTimetable();
    _fetchClasses();
  }

  Future<void> _fetchTimetable() async {
    try {
      final response = await http.get(Uri.parse('http://localhost:3000/schedule'));
      print('Response status code: ${response.statusCode}'); // Debug log
      print('Response body: ${response.body}'); // Debug log

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print('Decoded data: $data'); // Debug log
        setState(() {
          _timetableData = data;
          _isLoading = false;
        });
      } else {
        throw Exception('Failed to load timetable');
      }
    } catch (e) {
      print('Error fetching timetable: $e'); // Debug log
      setState(() {
        _isLoading = false;
        _errorMessage = 'Failed to load timetable. Please try again.';
      });
    }
  }

  Future<void> _fetchClasses() async {
    try {
      final response = await http.get(Uri.parse('http://localhost:3000/classes'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          _classes = data;
        });
      } else {
        throw Exception('Failed to load classes');
      }
    } catch (e) {
      print('Error fetching classes: $e'); // Debug log
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error fetching classes: $e')),
      );
    }
  }

  List<dynamic> _getFilteredTimetable() {
    if (_selectedClass == null || _selectedClass!.isEmpty) {
      return _timetableData;
    }
    return _timetableData.where((entry) => entry['class']?['name'] == _selectedClass).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filteredTimetable = _getFilteredTimetable();

    return Scaffold(
      appBar: AppBar(
        title: Image.asset("images/logos/appbar-logo.png"),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage.isNotEmpty
              ? Center(child: Text(_errorMessage, style: TextStyle(color: Colors.red, fontSize: 16)))
              : Column(
                  children: [
                    // Class Filter Dropdown
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: DropdownButtonFormField<String>(
                        value: _selectedClass,
                        decoration: InputDecoration(
                          labelText: 'Filter by Class',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        items: _classes.map<DropdownMenuItem<String>>((classEntity) {
                          return DropdownMenuItem(
                            value: classEntity['name'],
                            child: Text(classEntity['name']),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedClass = value;
                          });
                        },
                      ),
                    ),
                    // Timetable Data
                    Expanded(
                      child: SingleChildScrollView(
                        scrollDirection: Axis.vertical,
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // Table Header
                              Container(
                                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                                decoration: BoxDecoration(
                                  color: Colors.blueAccent,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Row(
                                  children: [
                                    Expanded(flex: 2, child: Text('Day', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                                    Expanded(flex: 2, child: Text('Start Time', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                                    Expanded(flex: 2, child: Text('End Time', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                                    Expanded(flex: 3, child: Text('Teacher', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                                    Expanded(flex: 3, child: Text('Subject', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                                    Expanded(flex: 2, child: Text('Class', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                                    Expanded(flex: 3, child: Text('Classroom', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 8),
                              // Table Rows
                              ListView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: filteredTimetable.length,
                                itemBuilder: (context, index) {
                                  final entry = filteredTimetable[index];
                                  return Card(
                                    margin: const EdgeInsets.symmetric(vertical: 4),
                                    elevation: 2,
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                                      child: Row(
                                        children: [
                                          Expanded(flex: 2, child: Text(entry['day']?.toString() ?? 'N/A')),
                                          Expanded(flex: 2, child: Text(entry['startTime']?.toString() ?? 'N/A')),
                                          Expanded(flex: 2, child: Text(entry['endTime']?.toString() ?? 'N/A')),
                                          Expanded(flex: 3, child: Text(entry['teacher']?['name']?.toString() ?? 'N/A')),
                                          Expanded(flex: 3, child: Text(entry['subject']?['name']?.toString() ?? 'N/A')),
                                          Expanded(flex: 2, child: Text(entry['class']?['name']?.toString() ?? 'N/A')),
                                          Expanded(flex: 3, child: Text(entry['classroom']?['name']?.toString() ?? 'N/A')),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
    );
  }
}