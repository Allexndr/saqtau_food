import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ru: {
    translation: {
      // Navigation
      nav: {
        home: 'Главная',
        map: 'Карта',
        offers: 'Предложения',
        cart: 'Корзина',
        profile: 'Профиль',
        partners: 'Партнёры',
        about: 'О нас',
      },

      // Hero Section
      hero: {
        title: 'Спасаем еду и одежду от утилизации',
        subtitle: 'Выгодные покупки для осознанных потребителей и поддержка бизнеса в Казахстане',
        exploreFood: 'Исследовать SaqtauFood',
        exploreFashion: 'Исследовать SaqtauKiem',
        stats: {
          saved: 'Спасено продуктов',
          partners: 'Активных партнёров',
          users: 'Довольных пользователей',
          co2: 'CO₂ сэкономлено',
        },
      },

      // Categories
      categories: {
        food: 'Еда',
        fashion: 'Одежда',
        all: 'Все категории',
      },

      // Cart
      cart: {
        title: 'Корзина',
        empty: 'Ваша корзина пуста',
        addItems: 'Добавьте товары, чтобы начать покупки',
        total: 'Итого',
        commission: 'Комиссия платформы (15%)',
        discount: 'Скидка',
        finalTotal: 'К оплате',
        checkout: 'Оформить заказ',
        promoCode: 'Промокод',
        apply: 'Применить',
      },

      // Common
      common: {
        loading: 'Загрузка...',
        error: 'Ошибка',
        success: 'Успешно',
        save: 'Сохранить',
        cancel: 'Отмена',
        delete: 'Удалить',
        edit: 'Редактировать',
        add: 'Добавить',
        search: 'Поиск',
        filter: 'Фильтр',
        sort: 'Сортировка',
        close: 'Закрыть',
        back: 'Назад',
        next: 'Далее',
        previous: 'Предыдущий',
        continue: 'Продолжить',
        finish: 'Завершить',
        yes: 'Да',
        no: 'Нет',
      },

      // AI Features
      ai: {
        recommendations: 'Рекомендации для вас',
        smartSearch: 'Умный поиск',
        priceOptimization: 'Оптимизация цен',
        demandPrediction: 'Прогноз спроса',
      },
    },
  },
  kz: {
    translation: {
      // Navigation
      nav: {
        home: 'Басты бет',
        map: 'Карта',
        offers: 'Ұсыныстар',
        cart: 'Себет',
        profile: 'Профиль',
        partners: 'Серіктестер',
        about: 'Біз туралы',
      },

      // Hero Section
      hero: {
        title: 'Тағам мен киімді утилизациядан құтқарамыз',
        subtitle: 'Саналы тұтынушыларға тиімді сатып алу және Қазақстандағы бизнеске қолдау',
        exploreFood: 'SaqtauFood зерттеу',
        exploreFashion: 'SaqtauKiem зерттеу',
        stats: {
          saved: 'Құтқарылған өнімдер',
          partners: 'Белсенді серіктестер',
          users: 'Қанағаттанған пайдаланушылар',
          co2: 'Үнемделген CO₂',
        },
      },

      // Categories
      categories: {
        food: 'Тағам',
        fashion: 'Киім',
        all: 'Барлық санаттар',
      },

      // Cart
      cart: {
        title: 'Себет',
        empty: 'Сіздің себетіңіз бос',
        addItems: 'Сатып алуды бастау үшін тауарлар қосыңыз',
        total: 'Жалпы',
        commission: 'Платформа комиссиясы (15%)',
        discount: 'Жеңілдік',
        finalTotal: 'Төлемге',
        checkout: 'Тапсырысты рәсімдеу',
        promoCode: 'Промокод',
        apply: 'Қолдану',
      },

      // Common
      common: {
        loading: 'Жүктелуде...',
        error: 'Қате',
        success: 'Сәтті',
        save: 'Сақтау',
        cancel: 'Бас тарту',
        delete: 'Жою',
        edit: 'Өңдеу',
        add: 'Қосу',
        search: 'Іздеу',
        filter: 'Сүзгі',
        sort: 'Сұрыптау',
        close: 'Жабу',
        back: 'Артқа',
        next: 'Келесі',
        previous: 'Алдыңғы',
        continue: 'Жалғастыру',
        finish: 'Аяқтау',
        yes: 'Иә',
        no: 'Жоқ',
      },

      // AI Features
      ai: {
        recommendations: 'Сізге ұсыныстар',
        smartSearch: 'Ақылды іздеу',
        priceOptimization: 'Бағаны оңтайландыру',
        demandPrediction: 'Сұраныс болжамы',
      },
    },
  },
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        map: 'Map',
        offers: 'Offers',
        cart: 'Cart',
        profile: 'Profile',
        partners: 'Partners',
        about: 'About',
      },

      // Hero Section
      hero: {
        title: 'Saving food and clothes from disposal',
        subtitle: 'Beneficial purchases for conscious consumers and business support in Kazakhstan',
        exploreFood: 'Explore SaqtauFood',
        exploreFashion: 'Explore SaqtauKiem',
        stats: {
          saved: 'Products saved',
          partners: 'Active partners',
          users: 'Satisfied users',
          co2: 'CO₂ saved',
        },
      },

      // Categories
      categories: {
        food: 'Food',
        fashion: 'Fashion',
        all: 'All categories',
      },

      // Cart
      cart: {
        title: 'Cart',
        empty: 'Your cart is empty',
        addItems: 'Add items to start shopping',
        total: 'Total',
        commission: 'Platform commission (15%)',
        discount: 'Discount',
        finalTotal: 'To pay',
        checkout: 'Checkout',
        promoCode: 'Promo code',
        apply: 'Apply',
      },

      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        continue: 'Continue',
        finish: 'Finish',
        yes: 'Yes',
        no: 'No',
      },

      // AI Features
      ai: {
        recommendations: 'Recommendations for you',
        smartSearch: 'Smart search',
        priceOptimization: 'Price optimization',
        demandPrediction: 'Demand prediction',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  });

export default i18n;
