import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:path_provider/path_provider.dart';
import 'dart:io';
import 'package:open_file/open_file.dart';
import 'package:permission_handler/permission_handler.dart'; // For runtime permissions

class TableScreen extends StatefulWidget {
  final int classId; // Pass the class ID to the screen

  const TableScreen({super.key, required this.classId});

  @override
  _TableScreenState createState() => _TableScreenState();
}

class _TableScreenState extends State<TableScreen> {
  List<dynamic> _timetableData = [];
  bool _isLoading = true;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    _fetchTimetable();
  }

  Future<void> _fetchTimetable() async {
    try {
      final response = await http.get(Uri.parse('http://localhost:3000/classes/${widget.classId}/timetable'));
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

  // Function to download the timetable as a CSV file
  Future<void> _downloadTimetable() async {
    try {
      // Request storage permissions
      final status = await Permission.storage.request();
      if (!status.isGranted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Storage permission denied')),
        );
        return;
      }

      // Convert timetable data to CSV format
      final csvData = _convertToCsv(_timetableData);

      // Get the directory for saving the file
      final directory = await getApplicationDocumentsDirectory();
      final filePath = '${directory.path}/timetable.csv';
      print('File path: $filePath'); // Debug log

      // Write the CSV data to the file
      final file = File(filePath);
      await file.writeAsString(csvData);
      print('File written successfully'); // Debug log

      // Open the file after saving
      await OpenFile.open(filePath);
      print('File opened successfully'); // Debug log

      // Show a success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Timetable downloaded successfully!')),
      );
    } catch (e, stackTrace) {
      print('Error downloading timetable: $e'); // Debug log
      print('Stack trace: $stackTrace'); // Debug log
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to download timetable. Please try again.')),
      );
    }
  }

  // Function to convert timetable data to CSV format
  String _convertToCsv(List<dynamic> timetableData) {
    final csvBuffer = StringBuffer();

    // Add CSV header
    csvBuffer.writeln('Day,Start Time,End Time,Teacher,Subject,Classroom');

    // Add CSV rows
    for (final entry in timetableData) {
      csvBuffer.writeln(
        '${entry['day']},${entry['startTime']},${entry['endTime']},${entry['teacher']?['name']},${entry['subject']?['name']},${entry['classroom']?['name']}',
      );
    }

    return csvBuffer.toString();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Class Timetable'),
        actions: [
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: _downloadTimetable,
            tooltip: 'Download Timetable',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage.isNotEmpty
              ? Center(child: Text(_errorMessage, style: TextStyle(color: Colors.red, fontSize: 16)))
              : SingleChildScrollView(
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
                              Expanded(flex: 3, child: Text('Classroom', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))),
                            ],
                          ),
                        ),
                        const SizedBox(height: 8),
                        // Table Rows
                        ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _timetableData.length,
                          itemBuilder: (context, index) {
                            final entry = _timetableData[index];
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
    );
  }
}