import 'dart:convert';
import 'package:http/http.dart' as http;
import 'matiere.dart';
import '../../config.dart'; // Ensure this imports the correct file path

class MatiereService {
  final String baseUrl = "http://localhost:3000"; // Récupère depuis config.dart
  String get subjectsUrl => '$baseUrl/subjects';

  // Fetch all subjects from the backend
  Future<List<Matiere>> fetchMatieres() async {
    try {
      final response = await http.get(Uri.parse(subjectsUrl)).timeout(Duration(seconds: 10));

      if (response.statusCode == 200) {
        List<dynamic> data = json.decode(response.body);
        return data.map((subject) => Matiere.fromJson(subject)).toList();
      } else {
        final errorMessage = json.decode(response.body)['message'] ?? 'Unknown error';
        throw Exception('Failed to load subjects. Server says: $errorMessage');
      }
    } catch (e) {
      throw Exception('Error fetching subjects: $e');
    }
  }

  // Add a new subject to the backend
  Future<void> addMatiere(Matiere matiere) async {
    try {
      final response = await http
          .post(
            Uri.parse(subjectsUrl),
            headers: {'Content-Type': 'application/json'},
            body: json.encode({'name': matiere.name}),
          )
          .timeout(Duration(seconds: 10));

      if (response.statusCode != 201) {
        final errorMessage = json.decode(response.body)['message'] ?? 'Unknown error';
        throw Exception('Failed to add subject. Server says: $errorMessage');
      } else {
        print('Subject added successfully.');
      }
    } catch (e) {
      throw Exception('Error adding subject: $e');
    }
  }

//  // Update an existing subject
// Future<void> updateMatiere(int id, Matiere matiere) async {
//   try {
//     final response = await http
//         .put(
//           Uri.parse('$subjectsUrl/$id'),
//           headers: {'Content-Type': 'application/json'},
//           body: json.encode({'name': matiere.name}),
//         )
//         .timeout(Duration(seconds: 10));

//     if (response.statusCode != 200) {
//       final errorMessage = json.decode(response.body)['message'] ?? 'Unknown error';
//       throw Exception('Failed to update subject. Server says: $errorMessage');
//     } else {
//       print('Subject updated successfully.');
//     }
//   } catch (e) {
//     throw Exception('Error updating subject: $e');
//   }
// }

// Delete a subject by ID
Future<void> deleteMatiere(int id) async {
  try {
    final response = await http
        .delete(
          Uri.parse('$subjectsUrl/$id'),
        )
        .timeout(Duration(seconds: 10));

    if (response.statusCode != 200) {
      final errorMessage = json.decode(response.body)['message'] ?? 'Unknown error';
      throw Exception('Failed to delete subject. Server says: $errorMessage');
    } else {
      print('Subject deleted successfully.');
    }
  } catch (e) {
    throw Exception('Error deleting subject: $e');
  }
}
}