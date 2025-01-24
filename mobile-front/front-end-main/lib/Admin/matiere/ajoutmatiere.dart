import 'package:flutter/material.dart';
import 'package:timemastermobile_front/widgets/container_info.dart';
import 'matiere.dart';
import 'matiere_service.dart';

class AjoutMatiereScreen extends StatefulWidget {
  @override
  _AjoutMatiereScreenState createState() => _AjoutMatiereScreenState();
}

class _AjoutMatiereScreenState extends State<AjoutMatiereScreen> {
  final MatiereService matiereService = MatiereService();
  final TextEditingController nameController = TextEditingController();
  List<Matiere> matieres = [];

  @override
  void initState() {
    super.initState();
    _loadMatieres();
  }

  Future<void> _loadMatieres() async {
    try {
      List<Matiere> loadedMatieres = await matiereService.fetchMatieres();
      setState(() {
        matieres = loadedMatieres;
      });
    } catch (e, stackTrace) {
      print('Erreur lors du chargement des matières : $e');
      print('Trace de l\'erreur : $stackTrace');
    }
  }

  Future<void> _addMatiere() async {
    String name = nameController.text;
    if (name.isNotEmpty) {
      try {
        await matiereService.addMatiere(Matiere(id: 0, name: name)); // ID est temporaire, le backend générera un nouvel ID

        nameController.clear();
        _loadMatieres();

        // SnackBar pour le succès
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Matière ajoutée avec succès !'),
            backgroundColor: Colors.green,
          ),
        );
      } catch (e, stackTrace) {
        print('Erreur lors de l\'ajout de la matière : $e');
        print('Trace de l\'erreur : $stackTrace');

        // SnackBar pour l'erreur
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Échec de l\'ajout de la matière ! Erreur : $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Veuillez entrer un nom de matière.'),
          backgroundColor: Colors.orange,
        ),
      );
    }
  }

  // Future<void> _updateMatiere(int id, String newName) async {
  //   if (newName.isNotEmpty) {
  //     try {
  //       await matiereService.updateMatiere(id, Matiere(id: id, name: newName));
  //       _loadMatieres();

  //       // SnackBar pour le succès
  //       ScaffoldMessenger.of(context).showSnackBar(
  //         SnackBar(
  //           content: Text('Matière mise à jour avec succès !'),
  //           backgroundColor: Colors.green,
  //         ),
  //       );
  //     } catch (e, stackTrace) {
  //       print('Erreur lors de la mise à jour de la matière : $e');
  //       print('Trace de l\'erreur : $stackTrace');

  //       // SnackBar pour l'erreur
  //       ScaffoldMessenger.of(context).showSnackBar(
  //         SnackBar(
  //           content: Text('Échec de la mise à jour de la matière ! Erreur : $e'),
  //           backgroundColor: Colors.red,
  //         ),
  //       );
  //     }
  //   } else {
  //     ScaffoldMessenger.of(context).showSnackBar(
  //       SnackBar(
  //         content: Text('Veuillez entrer un nom de matière.'),
  //         backgroundColor: Colors.orange,
  //       ),
  //     );
  //   }
  // }

  Future<void> _deleteMatiere(int id) async {
    try {
      await matiereService.deleteMatiere(id);
      _loadMatieres();

      // SnackBar pour le succès
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Matière supprimée avec succès !'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e, stackTrace) {
      print('Erreur lors de la suppression de la matière : $e');
      print('Trace de l\'erreur : $stackTrace');

      // SnackBar pour l'erreur
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Échec de la suppression de la matière ! Erreur : $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Image.asset("images/logos/appbar-logo.png"),
        backgroundColor: const Color.fromRGBO(65, 105, 225, 1),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const ContainerInfo(
              titleContainer: "Ajouter une matière",
              imageUrl: 'images/graphic-icons/books.png',
            ),
            SizedBox(height: 30),
            Text(
              "Entrez le nom de la matière",
              style: TextStyle(
                color: Color.fromRGBO(65, 105, 225, 1),
                fontSize: 17,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: nameController,
                    decoration: InputDecoration(
                      hintText: 'Nom de la matière',
                      filled: true,
                      fillColor: Colors.grey[200],
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 10),
                ElevatedButton(
                  onPressed: _addMatiere,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromRGBO(65, 105, 225, 1),
                    padding: EdgeInsets.symmetric(vertical: 15),
                    minimumSize: Size(80, 50),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: Text(
                    "OK",
                    style: TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
              ],
            ),
            SizedBox(height: 20),
            Expanded(
              child: matieres.isEmpty
                  ? Center(
                      child: Text(
                        "Aucune matière disponible.",
                        style: TextStyle(fontSize: 16, color: Colors.grey),
                      ),
                    )
                  : ListView.builder(
                      itemCount: matieres.length,
                      itemBuilder: (context, index) {
                        return ListTile(
                          leading: Icon(Icons.circle,
                              size: 10, color: Color.fromRGBO(65, 105, 225, 1)),
                          title: Text(matieres[index].name),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              // IconButton(
                              //   icon: Icon(Icons.edit, color: Colors.blue),
                              //   onPressed: () {
                              //     _showUpdateDialog(matieres[index].id, matieres[index].name);
                              //   },
                              // ),
                              IconButton(
                                icon: Icon(Icons.delete, color: Colors.red),
                                onPressed: () {
                                  _deleteMatiere(matieres[index].id);
                                },
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  // void _showUpdateDialog(int id, String currentName) {
  //   TextEditingController updateController = TextEditingController(text: currentName);

  //   showDialog(
  //     context: context,
  //     builder: (context) {
  //       return AlertDialog(
  //         title: Text('Modifier la matière'),
  //         content: TextField(
  //           controller: updateController,
  //           decoration: InputDecoration(hintText: 'Entrez le nouveau nom de la matière'),
  //         ),
  //         actions: [
  //           TextButton(
  //             onPressed: () {
  //               Navigator.pop(context);
  //             },
  //             child: Text('Annuler'),
  //           ),
  //           TextButton(
  //             onPressed: () {
  //               _updateMatiere(id, updateController.text);
  //               Navigator.pop(context);
  //             },
  //             child: Text('Modifier'),
  //           ),
  //         ],
  //       );
  //     },
  //   );
  // }
}