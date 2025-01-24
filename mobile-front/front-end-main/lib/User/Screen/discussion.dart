import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class DiscussionScreen extends StatefulWidget {
  @override
  _DiscussionScreenState createState() => _DiscussionScreenState();
}

class _DiscussionScreenState extends State<DiscussionScreen> {
  final TextEditingController classController = TextEditingController();
  final TextEditingController subjectController = TextEditingController();
  final TextEditingController problemController = TextEditingController();
  DateTime? selectedDate;
  TimeOfDay? selectedTime;

  List<String> classes = []; // Dynamic list of classes
  List<String> subjects = []; // Dynamic list of subjects

  @override
  void initState() {
    super.initState();
    _fetchClasses(); // Fetch classes from the backend
    _fetchSubjects(); // Fetch subjects from the backend
  }

  // Fetch classes from the backend
  Future<void> _fetchClasses() async {
    final response = await http.get(Uri.parse('http://localhost:3000/classes'));
    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      setState(() {
        classes = data.map((item) => item['name'].toString()).toList();
      });
    } else {
      throw Exception('Failed to load classes');
    }
  }

  // Fetch subjects from the backend
  Future<void> _fetchSubjects() async {
    final response = await http.get(Uri.parse('http://localhost:3000/subjects'));
    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      setState(() {
        subjects = data.map((item) => item['name'].toString()).toList();
      });
    } else {
      throw Exception('Failed to load subjects');
    }
  }

  // Select date
  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2023),
      lastDate: DateTime(2024),
    );
    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
      });
    }
  }

  // Select time
  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (picked != null && picked != selectedTime) {
      setState(() {
        selectedTime = picked;
      });
    }
  }

  // Submit the form
  Future<void> _submitForm() async {
    if (classController.text.trim().isEmpty ||
        subjectController.text.trim().isEmpty ||
        selectedDate == null ||
        selectedTime == null ||
        problemController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Please fill all fields"),
          backgroundColor: Colors.red,
        ),
      );
    } else {
      // Prepare the data to send to the backend
      final Map<String, dynamic> formData = {
        'className': classController.text,
        'subjectName': subjectController.text,
        'date': selectedDate!.toIso8601String(),
        'time': selectedTime!.format(context),
        'problem': problemController.text,
      };

      // Send the data to the backend
      final response = await http.post(
        Uri.parse('http://localhost:3000/report-issue'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(formData),
      );

      if (response.statusCode == 201) {
        // Success: Show a success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Issue reported successfully!"),
            backgroundColor: Colors.green,
          ),
        );

        // Clear the form
        classController.clear();
        subjectController.clear();
        setState(() {
          selectedDate = null;
          selectedTime = null;
        });
        problemController.clear();
      } else {
        // Error: Show an error message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Failed to report issue. Please try again."),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.blueAccent,
        title: Text(
          "Report Timetable Issue",
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        elevation: 10,
        shadowColor: Colors.blueAccent.withOpacity(0.5),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Dropdown for class
            DropdownButtonFormField<String>(
              decoration: InputDecoration(
                labelText: "Class",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.grey[100],
              ),
              items: classes.map((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  classController.text = value!;
                });
              },
            ),
            SizedBox(height: 16),

            // Dropdown for subject
            DropdownButtonFormField<String>(
              decoration: InputDecoration(
                labelText: "Subject",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.grey[100],
              ),
              items: subjects.map((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  subjectController.text = value!;
                });
              },
            ),
            SizedBox(height: 16),

            // Date picker
            InkWell(
              onTap: () => _selectDate(context),
              child: InputDecorator(
                decoration: InputDecoration(
                  labelText: "Date",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  filled: true,
                  fillColor: Colors.grey[100],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      selectedDate != null
                          ? "${selectedDate!.toLocal()}".split(' ')[0]
                          : "Select a date",
                      style: TextStyle(fontSize: 16),
                    ),
                    Icon(Icons.calendar_today, color: Colors.blueAccent),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),

            // Time picker
            InkWell(
              onTap: () => _selectTime(context),
              child: InputDecorator(
                decoration: InputDecoration(
                  labelText: "Time",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  filled: true,
                  fillColor: Colors.grey[100],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      selectedTime != null
                          ? "${selectedTime!.format(context)}"
                          : "Select a time",
                      style: TextStyle(fontSize: 16),
                    ),
                    Icon(Icons.access_time, color: Colors.blueAccent),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),

            // Problem description field
            TextField(
              controller: problemController,
              maxLines: 3,
              decoration: InputDecoration(
                labelText: "Problem Description",
                hintText: "Describe the issue with the timetable",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.grey[100],
              ),
            ),
            SizedBox(height: 24),

            // Submit button
            ElevatedButton(
              onPressed: _submitForm,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blueAccent,
                padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 5,
                shadowColor: Colors.blueAccent.withOpacity(0.5),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.send, color: Colors.white),
                  SizedBox(width: 8),
                  Text(
                    "Submit",
                    style: TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}