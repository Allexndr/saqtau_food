import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/api_service.dart';

// HCI: Cognitive Aspects - Centralized authentication state management
class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  // Initialize provider - check for stored auth
  Future<void> initialize() async {
    await ApiService.initialize();

    // Try to get user profile if token exists
    if (ApiService._authToken != null) {
      try {
        _user = await ApiService.getProfile();
        notifyListeners();
      } catch (e) {
        // Token might be invalid, clear it
        await ApiService.clearAuthToken();
      }
    }
  }

  // HCI: Interaction Design - Login with loading states and error handling
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.login(email, password);
      _user = User.fromJson(response['user']);

      // HCI: Data Gathering - Track successful login
      await ApiService.trackEvent('login', {
        'method': 'email',
        'user_id': _user!.id,
      });

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();

      // HCI: Data Gathering - Track failed login attempts
      await ApiService.trackEvent('login_failed', {
        'reason': e.toString(),
      });

      return false;
    }
  }

  // HCI: Interaction Design - Registration with validation
  Future<bool> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    String? phone,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.register(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
      );
      _user = User.fromJson(response['user']);

      // HCI: Data Gathering - Track successful registration
      await ApiService.trackEvent('register', {
        'user_id': _user!.id,
      });

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();

      // HCI: Data Gathering - Track failed registration
      await ApiService.trackEvent('register_failed', {
        'reason': e.toString(),
      });

      return false;
    }
  }

  // HCI: Interaction Design - Logout with cleanup
  Future<void> logout() async {
    // HCI: Data Gathering - Track logout
    await ApiService.trackEvent('logout', {
      'user_id': _user?.id,
    });

    _user = null;
    await ApiService.clearAuthToken();
    notifyListeners();
  }

  // HCI: Emotional Interaction - Clear error state
  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Update user profile
  Future<bool> updateProfile({
    String? firstName,
    String? lastName,
    String? phone,
    UserPreferences? preferences,
  }) async {
    if (_user == null) return false;

    _isLoading = true;
    notifyListeners();

    try {
      // This would call API to update profile
      // For now, just update locally
      if (firstName != null) _user = _user!.copyWith(firstName: firstName);
      if (lastName != null) _user = _user!.copyWith(lastName: lastName);
      if (phone != null) _user = _user!.copyWith(phone: phone);
      if (preferences != null) _user = _user!.copyWith(preferences: preferences);

      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}

// Extension to copy User with updated fields
extension UserCopyWith on User {
  User copyWith({
    String? firstName,
    String? lastName,
    String? phone,
    UserPreferences? preferences,
  }) {
    return User(
      id: id,
      email: email,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      phone: phone ?? this.phone,
      role: role,
      preferences: preferences ?? this.preferences,
      isVerified: isVerified,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}
