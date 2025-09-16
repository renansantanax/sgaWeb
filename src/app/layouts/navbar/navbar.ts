import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isMobileMenuOpen = false;
  isProfileMenuOpen = false;
  isAuthenticated: boolean = false;

  name = '';
  userName = '';
  userInitials = '';
  email = '';
  role = '';

  ngOnInit() {
    if (sessionStorage.getItem('user') != null) {
      this.isAuthenticated = true;

      var data = sessionStorage.getItem('user') as string;
      var json = JSON.parse(data);

      this.name = json.name;
      this.userName = json.username;
      this.userInitials = json.name.slice(0, 2).toUpperCase();
      this.email = json.email;
      this.role = json.role;
    }
  }

  logout() {
    if (window.confirm('Deseja realmente sair?')) {
      sessionStorage.removeItem('user');
      location.href = '/login';
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }
}
