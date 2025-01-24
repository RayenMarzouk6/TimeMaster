import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { ScheduleService } from 'src/app/services/schedule.service';

interface Message {
  sender: string;
  subject: string;
  content: string;
}
export interface TeacherProfile {
  id: number;
  name: string;
  institution: string;
  subjects: string[];
  classes: string[];
  email: string;
  phone?: string; // Optional field
  photoUrl?: string; // Optional field for profile picture
}

@Component({
  selector: 'app-teacher-home',
  templateUrl: './teacher-home.component.html',
  styleUrls: ['./teacher-home.component.css']
})
export class TeacherHomeComponent implements OnInit {
  teacherProfile: TeacherProfile = {
    id: 0,
    name: '',
    institution: '',
    subjects: [],
    classes: [],
    email: '',
    phone: '+1 234 567 890',
    photoUrl: 'assets/student1.png',
  };
  reclamationData = {
    name: '',
    email: '',
    message: '',
  };

  userDetails: any; // Add userDetails property

  events = [
    { image: 'assets/conf/1.jpg' },
    { image: 'assets/conf/2.jpg' },
    { image: 'assets/conf/3.jpg' },
    { image: 'assets/conf/4.jpg' },
    { image: 'assets/conf/5.jpg' },
    { image: 'assets/conf/6.jpg' },
    { image: 'assets/conf/7.jpg' },
    { image: 'assets/conf/8.jpg' },
    { image: 'assets/conf/9.jpg' },
    { image: 'assets/conf/10.jpg' }
  ];

  courses = [
    { image: 'assets/sem/1.jpg', title: 'Course 1' },
    { image: 'assets/sem/2.jpg', title: 'Course 2' },
    { image: 'assets/sem/3.jpg', title: 'Course 3' },
    { image: 'assets/sem/4.jpg', title: 'Course 4' },
    { image: 'assets/sem/5.jpg', title: 'Course 5' },
    { image: 'assets/sem/1.jpg', title: 'Course 1' },
    { image: 'assets/sem/2.jpg', title: 'Course 2' },
    { image: 'assets/sem/3.jpg', title: 'Course 3' },
    { image: 'assets/sem/4.jpg', title: 'Course 4' },
    { image: 'assets/sem/5.jpg', title: 'Course 5' },
  ];

  dashboardItems = [
    {
      title: "Profile Details",
      description: "Access your account information and personal details.",
      icon: "assets/user/1.png"
    },
    {
      title: "My Schedule",
      description: "Access your timetable, upcoming events, and deadlines.",
      icon: "assets/user/2.png"
    },
    {
      title: "Support Center",
      description: "Get help with common issues or contact support for assistance.",
      icon: "assets/user/6.png"
    },
    {
      title: "Manage Profile",
      description: "Update personal information, change your password, or upload a profile picture.",
      icon: "assets/user/3.png"
    },
    {
      title: "Notifications",
      description: "View your latest updates, reminders, or alerts.",
      icon: "assets/user/4.png"
    },
    {
      title: "Messages",
      description: "Communicate with your instructors, peers, or support team.",
      icon: "assets/user/5.png"
    },
    {
      title: "My Achievements",
      description: "Track your progress, certifications, and milestones.",
      icon: "assets/user/7.png"
    },
    {
      title: "Learning Resources",
      description: "Access study materials, guides, and helpful tools.",
      icon: "assets/user/8.png"
    }
  ];

  messages: Message[] = [
    { sender: 'John Doe', subject: 'Meeting Reminder', content: 'Don\'t forget about the meeting tomorrow at 10 AM.' },
    { sender: 'Jane Smith', subject: 'Course Update', content: 'Your course material has been updated, please check.' },
    { sender: 'HR Team', subject: 'Internship Opportunity', content: 'We have an exciting internship opportunity for you.' },
    { sender: 'Support', subject: 'Password Reset', content: 'You requested a password reset. Click the link below.' }
  ];

  notifications = [
    { title: 'New Assignment', description: 'You have a new assignment due in 3 days.' },
    { title: 'System Update', description: 'A system update is scheduled for tomorrow.' },
    { title: 'Event Reminder', description: 'Your upcoming event is starting soon.' }
  ];

  schedules: any[] = [];
  timeSlots = [
    { time: '08:00 - 09:00' },
    { time: '09:00 - 10:00' },
    { time: '10:00 - 11:00' },
    { time: '11:00 - 12:00' },
    { time: '12:00 - 13:00' },
    { time: '13:00 - 14:00' },
    { time: '14:00 - 15:00' },
    { time: '15:00 - 16:00' },
  ];
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  // Visibility flags for overlays
  isProfileVisible = false;
  isProfileFormVisible = false;
  isScheduleVisible = false;
  isMessagesVisible = false;
  isSupportVisible = false;
  dots = [0, 1, 2]; // 4 dots for navigation
  activeEventIndex = 0;
  activeCourseIndex = 0;
  selectedDay: string = '';
  selectedTeacher: string = '';
  selectedClass: string = '';

  [key: string]: any;  // This allows dynamic property access

  constructor(
    private authService: AuthService,
    private scheduleService: ScheduleService,
    private reclamationService: ReclamationService
  ) {}

  ngOnInit(): void {
    this.fetchSchedules();
  
    // Fetch user details from AuthService
    const fetchedDetails = this.authService.getUserDetails();
    if (fetchedDetails) {
      this.userDetails = fetchedDetails;
      console.log('Logged in user details:', this.userDetails);
  
      // Set the email field in reclamationData
      if (this.userDetails.email) {
        this.reclamationData.email = this.userDetails.email;
      } else {
        console.warn('User email not found in fetched details.');
      }
    } else {
      console.error('No user details found. Please log in.');
    }
  }
  getCoursesForSlotAndDay(slot: any, day: string): any[] {
    return this.filteredSchedules.filter((schedule) => {
      const [slotStart, slotEnd] = slot.time.split(' - ');
      return (
        schedule.startTime === slotStart &&
        schedule.endTime === slotEnd &&
        schedule.day === day
      );
    });
  }

  fetchSchedules(): void {
    this.scheduleService.getSchedules().subscribe(
      (data) => {
        this.schedules = data;
      },
      (error) => {
        console.error('Error fetching schedules:', error);
      }
    );
  }

  logout(): void {
    this.authService.logout(); // Call the logout method from AuthService
  }

  submitReclamation(): void {
    this.reclamationService.createReclamation(this.reclamationData).subscribe(
      (response) => {
        alert('Reclamation submitted successfully!');
        this.toggleSupport();
        // Reset form but retain the user's email
        this.reclamationData = { name: '', email: this.userDetails.email, message: '' };
      },
      (error) => {
        alert('Failed to submit reclamation. Please try again.');
      }
    );
  }

  get filteredSchedules(): any[] {
    return this.schedules.filter((schedule) => {
      return (
        (!this.selectedDay || schedule.day === this.selectedDay) &&
        (!this.selectedTeacher ||
          schedule.teacher?.name.toLowerCase().includes(this.selectedTeacher.toLowerCase())) &&
        (!this.selectedClass ||
          schedule.class?.name.toLowerCase().includes(this.selectedClass.toLowerCase()))
      );
    });
  }
  // Close other overlays when one is opened
  private closeOtherOverlays(activeOverlay: string): void {
    if (activeOverlay !== 'profile') this.isProfileFormVisible = false;
    if (activeOverlay !== 'details') this.isProfileVisible = false;

    if (activeOverlay !== 'schedule') this.isScheduleVisible = false;
    if (activeOverlay !== 'messages') this.isMessagesVisible = false;
    if (activeOverlay !== 'support') this.isSupportVisible = false;
  }

  // Print schedule
  printSchedule(): void {
    window.print();
  }

  scrollToEventGroup(index: number): void {
    this.activeEventIndex = index;
    const container = document.getElementById('events-container');
    const groupWidth = 350 * 3; // 3 cards per group (you can adjust this)
    if (container) {
      container.scrollTo({
        left: index * groupWidth,
        behavior: 'smooth'
      });
    }
  }

  scrollToCourseGroup(index: number): void {
    this.activeCourseIndex = index;
    const container = document.getElementById('courses-container');
    const groupWidth = 100 * 3; // 3 cards per group (you can adjust this)
    if (container) {
      container.scrollTo({
        left: index * groupWidth,
        behavior: 'smooth'
      });
    }
  }

  updateActiveDot(containerId: string, activeIndexName: string): void {
    const container = document.getElementById(containerId);
    const groupWidth = 200 * 3; // 3 cards per group (you can adjust this)

    if (container) {
      const scrollPosition = container.scrollLeft;
      const index = Math.floor(scrollPosition / groupWidth);

      // Dynamically access activeIndexName property
      if (this[activeIndexName] !== index) {
        this[activeIndexName] = index;
      }
    }
  }

  // Methods to toggle visibility
  toggleProfile(): void {
    this.isProfileVisible = !this.isProfileVisible;
    this.closeOtherOverlays('details');
  }

  toggleProfileForm(): void {
    this.isProfileFormVisible = !this.isProfileFormVisible;
    this.closeOtherOverlays('profile');
  }

  toggleSchedule(): void {
    this.isScheduleVisible = !this.isScheduleVisible;
    this.closeOtherOverlays('schedule');
  }

  toggleMessages(): void {
    this.isMessagesVisible = !this.isMessagesVisible;
    this.closeOtherOverlays('messages');
  }

  toggleSupport(): void {
    this.isSupportVisible = !this.isSupportVisible;
    this.closeOtherOverlays('support');
  }
}
