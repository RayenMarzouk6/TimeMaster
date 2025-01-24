import 'dart:convert';
import 'package:http/http.dart' as http;

class StudentService {
  final String baseUrl = 'http://localhost:3000'; // Replace with your backend URL

  Future<bool> addStudent(String name, int classId) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/students'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'name': name,
          'classId': classId,
        }),
      );

      print('Response status code: ${response.statusCode}'); // Debug log
      print('Response body: ${response.body}'); // Debug log

      if (response.statusCode == 201) {
        return true;
      } else {
        throw Exception('Failed to add student. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Error: $e'); // Debug log
      return false;
    }
  }

  Future<List<Map<String, dynamic>>> fetchClasses() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/classes'));

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('Fetched classes: $data'); // Debug log
        return data.cast<Map<String, dynamic>>();
      } else {
        throw Exception('Failed to fetch classes. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching classes: $e'); // Debug log
      return [];
    }
  }
}