import 'package:flutter/material.dart';

class AuthScreen extends StatefulWidget {
  final Function(String role) onAuthenticated;

  const AuthScreen({super.key, required this.onAuthenticated});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> with TickerProviderStateMixin {
  late TabController _tabController;
  final _loginFormKey = GlobalKey<FormState>();
  final _registerFormKey = GlobalKey<FormState>();

  // Login form fields
  String _loginEmail = '';
  String _loginPassword = '';
  String _loginRole = 'user';

  // Register form fields
  String _registerFirstName = '';
  String _registerLastName = '';
  String _registerEmail = '';
  String _registerPhone = '';
  String _registerPassword = '';
  String _registerConfirmPassword = '';
  String _registerRole = 'user';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Theme.of(context).primaryColor.withOpacity(0.1),
              Theme.of(context).secondaryHeaderColor.withOpacity(0.1),
            ],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 40),

                // Logo and title
                Icon(
                  Icons.store,
                  size: 80,
                  color: Theme.of(context).primaryColor,
                ),
                const SizedBox(height: 16),
                const Text(
                  '🍎 Saqtau Platform',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'Спасаем еду и одежду от утилизации',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: 40),

                // Tab bar
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.9),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: TabBar(
                    controller: _tabController,
                    labelColor: Theme.of(context).primaryColor,
                    unselectedLabelColor: Colors.grey,
                    indicatorColor: Theme.of(context).primaryColor,
                    tabs: const [
                      Tab(text: 'Вход'),
                      Tab(text: 'Регистрация'),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Tab content
                SizedBox(
                  height: 500, // Fixed height for tab content
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      _buildLoginTab(),
                      _buildRegisterTab(),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLoginTab() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Form(
        key: _loginFormKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              '🚪 Вход в систему',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),

            // Role selection
            const Text('Тип аккаунта:'),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: ChoiceChip(
                    label: const Text('👤 Покупатель'),
                    selected: _loginRole == 'user',
                    onSelected: (selected) {
                      if (selected) setState(() => _loginRole = 'user');
                    },
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ChoiceChip(
                    label: const Text('🏪 Продавец'),
                    selected: _loginRole == 'partner',
                    onSelected: (selected) {
                      if (selected) setState(() => _loginRole = 'partner');
                    },
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            TextFormField(
              decoration: const InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.email),
              ),
              keyboardType: TextInputType.emailAddress,
              validator: (value) {
                if (value?.isEmpty ?? true) return 'Введите email';
                if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value!)) {
                  return 'Введите корректный email';
                }
                return null;
              },
              onSaved: (value) => _loginEmail = value ?? '',
            ),

            const SizedBox(height: 16),

            TextFormField(
              decoration: const InputDecoration(
                labelText: 'Пароль',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.lock),
              ),
              obscureText: true,
              validator: (value) {
                if (value?.isEmpty ?? true) return 'Введите пароль';
                if (value!.length < 6) return 'Пароль должен содержать минимум 6 символов';
                return null;
              },
              onSaved: (value) => _loginPassword = value ?? '',
            ),

            const SizedBox(height: 24),

            ElevatedButton(
              onPressed: _handleLogin,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text('Войти', style: TextStyle(fontSize: 16)),
            ),

            const SizedBox(height: 16),

            TextButton(
              onPressed: () {},
              child: const Text('Забыли пароль?'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRegisterTab() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Form(
        key: _registerFormKey,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                '📝 Создание аккаунта',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),

              // Role selection
              const Text('Тип аккаунта:'),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: ChoiceChip(
                      label: const Text('👤 Покупатель'),
                      selected: _registerRole == 'user',
                      onSelected: (selected) {
                        if (selected) setState(() => _registerRole = 'user');
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ChoiceChip(
                      label: const Text('🏪 Продавец'),
                      selected: _registerRole == 'partner',
                      onSelected: (selected) {
                        if (selected) setState(() => _registerRole = 'partner');
                      },
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      decoration: const InputDecoration(
                        labelText: 'Имя',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value?.isEmpty ?? true) return 'Введите имя';
                        return null;
                      },
                      onSaved: (value) => _registerFirstName = value ?? '',
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      decoration: const InputDecoration(
                        labelText: 'Фамилия',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value?.isEmpty ?? true) return 'Введите фамилию';
                        return null;
                      },
                      onSaved: (value) => _registerLastName = value ?? '',
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.email),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value?.isEmpty ?? true) return 'Введите email';
                  if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value!)) {
                    return 'Введите корректный email';
                  }
                  return null;
                },
                onSaved: (value) => _registerEmail = value ?? '',
              ),

              const SizedBox(height: 16),

              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Телефон',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.phone),
                ),
                keyboardType: TextInputType.phone,
                onSaved: (value) => _registerPhone = value ?? '',
              ),

              const SizedBox(height: 16),

              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Пароль',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.lock),
                ),
                obscureText: true,
                validator: (value) {
                  if (value?.isEmpty ?? true) return 'Введите пароль';
                  if (value!.length < 6) return 'Пароль должен содержать минимум 6 символов';
                  return null;
                },
                onSaved: (value) => _registerPassword = value ?? '',
              ),

              const SizedBox(height: 16),

              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Подтвердите пароль',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.lock_outline),
                ),
                obscureText: true,
                validator: (value) {
                  if (value?.isEmpty ?? true) return 'Подтвердите пароль';
                  if (value != _registerPassword && _registerPassword.isNotEmpty) {
                    return 'Пароли не совпадают';
                  }
                  return null;
                },
                onSaved: (value) => _registerConfirmPassword = value ?? '',
              ),

              if (_registerRole == 'partner') ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.orange.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.orange.withOpacity(0.3)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.info, color: Colors.orange),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Для регистрации продавца потребуется верификация документов и бизнес-информации.',
                          style: TextStyle(fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 24),

              ElevatedButton(
                onPressed: _handleRegister,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text('Создать аккаунт', style: TextStyle(fontSize: 16)),
              ),

              const SizedBox(height: 16),

              Row(
                children: [
                  Checkbox(
                    value: true, // Mock - would be stateful
                    onChanged: (value) {},
                  ),
                  const Expanded(
                    child: Text(
                      'Я согласен с условиями использования и политикой конфиденциальности',
                      style: TextStyle(fontSize: 12),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _handleLogin() {
    if (_loginFormKey.currentState?.validate() ?? false) {
      _loginFormKey.currentState?.save();

      // Mock authentication - in real app this would call API
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Вход выполнен как ${_loginRole == 'partner' ? 'продавец' : 'покупатель'}')),
      );

      // Navigate based on role
      widget.onAuthenticated(_loginRole);
    }
  }

  void _handleRegister() {
    if (_registerFormKey.currentState?.validate() ?? false) {
      _registerFormKey.currentState?.save();

      // Mock registration - in real app this would call API
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Регистрация выполнена как ${_registerRole == 'partner' ? 'продавец' : 'покупатель'}')),
      );

      // Switch to login tab
      _tabController.animateTo(0);
    }
  }
}
