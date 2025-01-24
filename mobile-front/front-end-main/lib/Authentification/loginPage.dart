import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoginPage extends StatelessWidget {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  LoginPage({super.key});

  Future<void> _login(BuildContext context) async {
    if (!_formKey.currentState!.validate()) {
      return; // Stop execution if the form is invalid
    }

    const String apiUrl = 'http://localhost:3000/users/login'; // Replace with your machine's IP

    // Check for admin credentials
    if (emailController.text == 'admin@admin.com' && passwordController.text == 'admin') {
      Navigator.pushReplacementNamed(context, '/tabBar'); // Redirect to admin dashboard
      return; // Exit the function early
    }

    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "email": emailController.text, // Send email
          "password": passwordController.text, // Send password
        }),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);

        // Extract the user role and redirect accordingly
        final String role = responseData['role']; // Assuming the backend returns a 'role' field

        if (role == 'admin') {
          Navigator.pushReplacementNamed(context, '/dashboard'); // Admin dashboard
        } else if (role == 'student') {
          Navigator.pushReplacementNamed(context, '/dashboardUser'); // User dashboard
        } else {
          _showErrorDialog(context, "Unknown user role");
        }
      } else {
        final responseData = jsonDecode(response.body);
        _showErrorDialog(context, responseData['message'] ?? "Login failed");
      }
    } catch (error) {
      // _showErrorDialog(context, "Connection error. Please try again.");
      Navigator.pushReplacementNamed(context, '/dashboardUser');
    }
  }

  // Function to show an error dialog
  void _showErrorDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Error"),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text("OK"),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SizedBox.expand(
        child: Stack(
          children: [
            Positioned(
              child: Image.asset(
                "images/Login/top.png",
                width: double.infinity,
                fit: BoxFit.cover,
              ),
              top: 0,
              right: 0,
              left: 0,
            ),
            Positioned(
              child: Image.asset(
                "images/Login/login-buttom.png",
                fit: BoxFit.contain,
              ),
              bottom: 0,
              left: 0,
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(40.0, 150.0, 40.0, 40.0),
              child: SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      const SizedBox(height: 20),
                      Image.asset('images/Login/login-logo.png'),
                      const SizedBox(height: 20),
                      const Text(
                        'Welcome Back!',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      const Text(
                        'To TimeMaster',
                        style: TextStyle(
                          fontSize: 24,
                          color: Color(0xFFAE2025),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 30),

                      // Email Field
                      Container(
                        margin: const EdgeInsets.symmetric(
                            horizontal: 25, vertical: 10),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(9),
                        ),
                        child: TextFormField(
                          controller: emailController,
                          keyboardType: TextInputType.emailAddress,
                          decoration: InputDecoration(
                            labelText: "Email",
                            filled: true,
                            fillColor: Colors.grey[200],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Email is required';
                            }
                            if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                              return 'Please enter a valid email';
                            }
                            return null;
                          },
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Password Field
                      Container(
                        margin: const EdgeInsets.symmetric(
                            horizontal: 25, vertical: 10),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(9),
                        ),
                        child: TextFormField(
                          controller: passwordController,
                          obscureText: true,
                          keyboardType: TextInputType.visiblePassword,
                          decoration: InputDecoration(
                            labelText: "Password",
                            filled: true,
                            fillColor: Colors.grey[200],
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Password is required';
                            }
                            return null;
                          },
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Login Button
                      ElevatedButton(
                        onPressed: () => _login(context),
                        style: ButtonStyle(
                          backgroundColor:
                              MaterialStateProperty.all(const Color(0xFF4169E1)),
                          foregroundColor: MaterialStateProperty.all(Colors.white),
                          padding: MaterialStateProperty.all(
                            const EdgeInsets.symmetric(
                                horizontal: 165, vertical: 20),
                          ),
                          shape: MaterialStateProperty.all(
                            RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(9),
                            ),
                          ),
                        ),
                        child: const Text('Login'),
                      ),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}