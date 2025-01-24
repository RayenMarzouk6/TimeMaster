import 'package:flutter/material.dart';
import 'package:timemastermobile_front/Admin/DashboardAdmin/dashbord_page_screen.dart';
import 'package:timemastermobile_front/Admin/DashboardAdmin/drawer_admin.dart';
import 'package:timemastermobile_front/Admin/schedules/show_timetable_screen.dart';

class TabBarScreen extends StatefulWidget {
  const TabBarScreen({super.key});

  @override
  State<TabBarScreen> createState() => _TabBarScreenState();
}

class _TabBarScreenState extends State<TabBarScreen> {
  void _selecteScreenFromTabBar(int index) {
    setState(() {
      _selectedScreenIndex = index;
    });
  }

  int _selectedScreenIndex = 0;

  final List<Widget> _screens = [const DashbordPageScreen(), const ShowTimetableScreen()]; //const ScheduleScreen()

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Image.asset("images/logos/appbar-logo.png"),
      ),
      drawer: const DrawerPopup(), // Add the drawer here
      body: _screens[_selectedScreenIndex],
      bottomNavigationBar: BottomNavigationBar(
        onTap: _selecteScreenFromTabBar,
        backgroundColor: Theme.of(context).primaryColor,
        selectedItemColor: Colors.red[900],
        unselectedItemColor: Colors.white,
        currentIndex: _selectedScreenIndex, // Current selected tab
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.access_time),
            label: 'Schedule',
          ),
        ],
      ),
    );
  }
}