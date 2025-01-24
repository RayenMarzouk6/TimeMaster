class Matiere {
  final int id; // Add this field
  final String name;

  Matiere({required this.id, required this.name});

  // Convert JSON response to Matiere object
  factory Matiere.fromJson(Map<String, dynamic> json) {
    return Matiere(
      id: json['id'], // Ensure 'id' is included
      name: json['name'],
    );
  }

  // Convert Matiere object to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id, // Include 'id' when sending data to the backend
      'name': name,
    };
  }
}