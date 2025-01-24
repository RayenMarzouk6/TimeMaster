import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'checkemailpage.dart'; // Import Checkemailpage

class Signuppage extends StatefulWidget {
  const Signuppage({super.key});

  @override
  State<Signuppage> createState() => _SignuppageState();
}

class _SignuppageState extends State<Signuppage> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController cinController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    const String apiUrl = 'http://localhost:3000/users/verify'; // Use 10.0.2.2 for Android emulator

    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "email": emailController.text,
          "cin": cinController.text,
        }),
      );

      if (response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Registration successful. Check your email!')),
        );
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const Checkemailpage()),
        );
      } else {
        final Map<String, dynamic> responseData = jsonDecode(response.body);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(responseData['message'] ?? 'Registration failed.')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error connecting to the server.')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Positioned(
            child: Image.asset("images/SignUp/signup-top.png"),
            top: -120,
            right: 100,
          ),
          Positioned(
            child: Image.asset("images/SignUp/signup-logo.png"),
            right: 20,
            top: 20,
          ),
          Positioned(
            child: Image.asset("images/SignUp/signup-buttom.png"),
            bottom: 0,
          ),
          Center(
            child: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(width: 20),
                    Container(
                      margin: const EdgeInsets.symmetric(vertical: 40),
                      child: const Text(
                        "Please Fill out form to Register!",
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 32),
                      margin: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
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
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 32),
                      margin: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
                      child: TextFormField(
                        controller: cinController,
                        keyboardType: TextInputType.text,
                        decoration: InputDecoration(
                          labelText: "CIN",
                          filled: true,
                          fillColor: Colors.grey[200],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'CIN is required';
                          }
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(height: 30),
                    ElevatedButton(
                      onPressed: _isLoading ? null : _register,
                      style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all(const Color(0xFF4169E1)),
                        foregroundColor: MaterialStateProperty.all(Colors.white),
                        padding: MaterialStateProperty.all(
                          const EdgeInsets.symmetric(horizontal: 165, vertical: 20),
                        ),
                        shape: MaterialStateProperty.all(
                          RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(9),
                          ),
                        ),
                      ),
                      child: _isLoading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('Register'),
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
