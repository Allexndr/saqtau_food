import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

// HCI: Social Interaction - Multi-language support for Kazakhstan market
class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();

  late Map<String, String> _localizedStrings;

  Future<bool> load() async {
    String jsonString = await rootBundle.loadString('assets/lang/${locale.languageCode}.json');
    Map<String, dynamic> jsonMap = json.decode(jsonString);
    _localizedStrings = jsonMap.map((key, value) => MapEntry(key, value.toString()));
    return true;
  }

  String translate(String key) {
    return _localizedStrings[key] ?? key;
  }

  // Common translations
  String get appTitle => translate('app_title');
  String get home => translate('home');
  String get search => translate('search');
  String get cart => translate('cart');
  String get profile => translate('profile');
  String get login => translate('login');
  String get logout => translate('logout');
  String get register => translate('register');
  String get email => translate('email');
  String get password => translate('password');
  String get confirmPassword => translate('confirm_password');
  String get firstName => translate('first_name');
  String get lastName => translate('last_name');
  String get phone => translate('phone');
  String get save => translate('save');
  String get cancel => translate('cancel');
  String get loading => translate('loading');
  String get error => translate('error');
  String get success => translate('success');
  String get retry => translate('retry');
  String get noData => translate('no_data');
  String get food => translate('food');
  String get fashion => translate('fashion');
  String get allCategories => translate('all_categories');
  String get searchProducts => translate('search_products');
  String get addToCart => translate('add_to_cart');
  String get removeFromCart => translate('remove_from_cart');
  String get checkout => translate('checkout');
  String get total => translate('total');
  String get discount => translate('discount');
  String get commission => translate('commission');
  String get finalTotal => translate('final_total');
  String get promoCode => translate('promo_code');
  String get apply => translate('apply');
  String get order => translate('order');
  String get orders => translate('orders');
  String get orderHistory => translate('order_history');
  String get settings => translate('settings');
  String get language => translate('language');
  String get notifications => translate('notifications');
  String get location => translate('location');
  String get about => translate('about');
  String get contact => translate('contact');
  String get terms => translate('terms');
  String get privacy => translate('privacy');
  String get help => translate('help');
  String get support => translate('support');
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['ru', 'kz', 'en'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    AppLocalizations localizations = AppLocalizations(locale);
    await localizations.load();
    return localizations;
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
