# FluffyJobs 🐾

**Nowoczesna platforma do wyszukiwania i publikowania ofert pracy**

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![Django](https://img.shields.io/badge/Django-4.2+-green.svg)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

FluffyJobs to kompleksowa aplikacja webowa łącząca pracodawców z kandydatami. Oferuje intuicyjny interfejs, bezpieczne płatności testowe oraz logowanie przez Google OAuth.

## ✨ Funkcjonalności

- **💼 Zarządzanie ofertami pracy** - Dodawanie, edytowanie i przeglądanie ofert
- **🔐 Google OAuth** - Bezpieczne logowanie przez konto Google
- **💳 Płatności Stripe** - Testowe płatności za funkcje premium
- **🔍 Zaawansowane wyszukiwanie** - Filtrowanie ofert według kryteriów
- **📱 Responsywny design** - Dostosowany do urządzeń mobilnych
- **👥 System użytkowników** - Profile dla kandydatów i pracodawców

## 🛠 Technologie

### Backend
- **Django 4.2+** - Framework webowy
- **Django REST Framework** - API REST
- **Stripe** - Płatności testowe
- **Google OAuth** - Autoryzacja
- **SQLite** - Baza danych

### Frontend
- **React 18** - Biblioteka UI
- **Material-UI** - Komponenty UI
- **React Router** - Routing
- **Axios** - Klient HTTP

## 🚀 Instalacja

### Wymagania
- Python 3.8+
- Node.js 16+ i npm
- Git

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/jfabis/FluffyJobs.git
cd FluffyJobs
```

### 2. Backend (Django)

```bash
cd backend
python -m venv venv
```

Windows:
```bash
.\venv\Scripts\Activate.ps1
```

macOS/Linux:
```bash
source venv/bin/activate
```

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend (React)

```bash
cd frontend
npm install
npm start
```

## ⚙️ Konfiguracja

### Backend (.env)

```bash
# Django
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# Stripe (TYLKO TESTOWE!)
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_TEST_MODE=True
```

### Frontend (.env)

```bash
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
REACT_APP_API_URL=http://localhost:8000/api
```

## 🔑 Uzyskiwanie kluczy API

### Google OAuth
1. Przejdź do [Google Cloud Console](https://console.cloud.google.com/)
2. Utwórz projekt i włącz Google+ API
3. Utwórz OAuth Client ID (Web application)
4. Dodaj `http://localhost:3000` do authorized URIs
5. Skopiuj Client ID i Client Secret

### Stripe
1. Zarejestruj się na [Stripe](https://stripe.com/)
2. Przejdź do Dashboard → Developers → API keys
3. Upewnij się, że jesteś w **trybie testowym**
4. Skopiuj Publishable key i Secret key

## 💳 Testowe karty płatnicze

| Numer karty | Rezultat |
|-------------|----------|
| `4242 4242 4242 4242` | ✅ Płatność udana |
| `4000 0000 0000 0002` | ❌ Płatność odrzucona |
| `5555 5555 5555 4444` | ✅ Mastercard udana |

**Data ważności**: Dowolna przyszła (np. `12/25`)
**CVC**: Dowolny 3-cyfrowy kod (np. `123`)

## 🎮 Użytkowanie

1. **Uruchom backend**: `python manage.py runserver` (port 8000)
2. **Uruchom frontend**: `npm start` (port 3000)
3. **Otwórz**: http://localhost:3000
4. **Zaloguj się** przez Google OAuth
5. **Przeglądaj oferty** lub dodaj własne
6. **Testuj płatności** z kartami testowymi

## 📁 Struktura projektu

```
FluffyJobs/
├── backend/                # Django backend
│   ├── apps/
│   │   ├── jobs/           # Oferty pracy
│   │   ├── payments/       # Płatności Stripe
│   │   └── users/          # Użytkownicy
│   └── manage.py
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Komponenty React
│   │   ├── pages/          # Strony aplikacji
│   │   └── context/        # Context providers
│   └── package.json
└── README.md
```

## 🧪 Testowanie

Backend:
```bash
cd backend
python manage.py test
```

Frontend:
```bash
cd frontend
npm test
```

## 🤝 Współpraca

1. Fork repozytorium
2. Utwórz branch: `git checkout -b feature/nazwa-funkcji`
3. Commit: `git commit -m 'Dodaj nową funkcję'`
4. Push: `git push origin feature/nazwa-funkcji`
5. Otwórz Pull Request

## 📄 Licencja

MIT License - zobacz [LICENSE](LICENSE)

## 👨‍💻 Autor

**Jan Fabisiak** - [jfabis](https://github.com/jfabis)

---

⚠️ **Uwaga**: Aplikacja używa tylko testowych płatności Stripe. Żadne prawdziwe transakcje nie są przetwarzane.
