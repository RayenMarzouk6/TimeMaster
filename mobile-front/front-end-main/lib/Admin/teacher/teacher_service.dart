import 'dart:convert';
import 'package:http/http.dart' as http;

class TeacherService {
  static const String baseUrl = "http://localhost:3000/teachers"; // Adjust if needed

  Future<List<dynamic>> getAllTeachers() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception("Failed to load teachers");
    }
  }

  Future<void> addTeacher(String name, List<int> subjectIds) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {"Content-Type": "application/json"},
      body: json.encode({
        "name": name,
        "subjectIds": subjectIds, // Include subject IDs in the request body
      }),
    );
    if (response.statusCode != 201) {
      throw Exception("Failed to add teacher");
    }
  }

  Future<void> deleteTeacher(int id) async {
    final response = await http.delete(Uri.parse("$baseUrl/$id"));
    if (response.statusCode != 200) {
      throw Exception("Failed to delete teacher");
    }
  }
}