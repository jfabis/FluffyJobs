# FluffyJobs 🐾

**Nowoczesna platforma do wyszukiwania i publikowania ofert pracy z zaawansowanymi funkcjami płatności i autoryzacji.**

FluffyJobs to kompleksowa aplikacja webowa łącząca pracodawców z kandydatami, oferująca intuicyjny interfejs, bezpieczne płatności testowe oraz logowanie przez Google OAuth.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Django](https://img.shields.io/badge/Django-4.2+-green.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🚀 Funkcjonalności

- **💼 Zarządzanie ofertami pracy** - Dodawanie, edytowanie i przeglądanie ofert
- **🔐 Autoryzacja Google OAuth** - Bezpieczne logowanie przez konto Google
- **💳 Testowe płatności Stripe** - Symulacja płatności za promocję ofert
- **👥 System użytkowników** - Rejestracja i zarządzanie profilami
- **📱 Responsywny design** - Dostosowany do urządzeń mobilnych
- **🔍 Zaawansowane wyszukiwanie** - Filtrowanie ofert według kryteriów

## 📋 Wymagania

Przed rozpoczęciem upewnij się, że masz zainstalowane:

- **Python 3.8+**
- **Node.js 16+** i **npm**
- **Git**
- Konto **Google Cloud** (dla OAuth)
- Konto **Stripe** (dla testowych płatności)

## 🛠️ Instalacja

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/jfabis/FluffyJobs.git
cd FluffyJobs
```

### 2. Konfiguracja Backend (Django)

Utwórz środowisko wirtualne

```bash
python -m venv venv
```

Aktywuj środowisko wirtualne Windows PowerShell:

```bash
.\venv\Scripts\Activate.ps1
```

Windows CMD:

```bash
venv\Scripts\activate.bat
```

macOS/Linux:

```bash
source venv/bin/activate
```

Przejdź do katalogu backend

```bash
cd backend
```

Zainstaluj zależności

```bash
pip install -r requirements.txt
```

Utwórz plik .env

```bash
copy .env.example .env
```

### 3. Konfiguracja Frontend (React)

Przejdź do katalogu frontend

```bash
cd ../frontend
```

Zainstaluj zależności npm

```bash
npm install
```

Utwórz plik .env

```bash
copy .env.example .env
```

## ⚙️ Konfiguracja zmiennych środowiskowych

### Backend (.env)

Utwórz plik `backend/.env` z następującymi zmiennymi:

```bash
# Django
SECRET_KEY=your-super-secret-django-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# Stripe (TYLKO TESTOWE KLUCZE!)
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_TEST_MODE=True
```

### Frontend (.env)

Utwórz plik `frontend/.env` z następującymi zmiennymi:

```bash
# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Stripe (TYLKO TESTOWE KLUCZE!)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# API URL
REACT_APP_API_URL=http://localhost:8000/api
```

## 🔑 Uzyskiwanie kluczy API

### Google OAuth

1. Przejdź do [Google Cloud Console](https://console.cloud.google.com/)
2. Utwórz nowy projekt lub wybierz istniejący
3. Włącz **Google+ API**
4. Przejdź do **Credentials** → **Create Credentials** → **OAuth Client ID**
5. Wybierz **Web application**
6. Dodaj authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
7. Skopiuj **Client ID** i **Client Secret**

### Stripe (Tryb testowy)

1. Zarejestruj się na [Stripe](https://stripe.com/)
2. Przejdź do **Dashboard** → **Developers** → **API keys**
3. Upewnij się, że jesteś w **trybie testowym** (Test mode)
4. Skopiuj **Publishable key** i **Secret key**

⚠️ **WAŻNE**: Używaj TYLKO testowych kluczy Stripe (zaczynających się od `pk_test_` i `sk_test_`)

## 🚀 Uruchomienie aplikacji

### 1. Uruchom backend

Upewnij się, że środowisko wirtualne jest aktywne

```bash
cd backend
```

Wykonaj migracje bazy danych

```bash
python manage.py makemigrations
python manage.py migrate
```

Utwórz superużytkownika (opcjonalnie)

```bash
python manage.py createsuperuser
```

Uruchom serwer Django

```bash
python manage.py runserver
```

Backend będzie dostępny pod adresem: `http://localhost:8000`

### 2. Uruchom frontend

W nowym terminalu przejdź do katalogu frontend

```bash
cd frontend
```

Uruchom serwer React

```bash
npm start
```

Frontend będzie dostępny pod adresem: `http://localhost:3000`

## 💳 Testowanie płatności

Aplikacja używa **tylko testowych płatności Stripe**. Użyj następujących testowych numerów kart:

| Typ karty | Numer | Rezultat |
|-----------|-------|----------|
| Visa | `4242 4242 4242 4242` | ✅ Płatność zakończona sukcesem |
| Visa | `4000 0000 0000 0002` | ❌ Płatność odrzucona |
| Mastercard | `5555 5555 5555 4444` | ✅ Płatność zakończona sukcesem |
| American Express | `3782 822463 10005` | ✅ Płatność zakończona sukcesem |

**Dodatkowe dane testowe:**
- **Data ważności**: Dowolna przyszła data (np. `12/25`)
- **CVC**: Dowolny 3-cyfrowy kod (np. `123`)
- **Kod pocztowy**: Dowolny (np. `12345`)

## 📁 Struktura projektu

```
FluffyJobs/
├── backend/                # Django backend
│   ├── authentication/     # Moduł autoryzacji Google OAuth
│   ├── payments/           # Moduł płatności Stripe
│   ├── jobs/               # Moduł ofert pracy
│   ├── users/              # Moduł użytkowników
│   └── manage.py
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Komponenty React
│   │   ├── services/       # Serwisy API
│   │   └── pages/          # Strony aplikacji
│   └── package.json
├── venv/                   # Środowisko wirtualne Python
└── README.md
```

## 🧪 Testowanie

### Backend

```bash
cd backend
python manage.py test
```

### Frontend

```bash
cd frontend
npm test
```

## 🐛 Rozwiązywanie problemów

### Problem z aktywacją środowiska wirtualnego

Zmień politykę wykonywania PowerShell

```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Następnie aktywuj środowisko

```bash
.\venv\Scripts\Activate.ps1
```

### Błąd "Module not found"

Upewnij się, że środowisko wirtualne jest aktywne

```bash
pip install -r requirements.txt
```

### Problemy z CORS

Sprawdź czy w `settings.py` masz poprawnie skonfigurowane `CORS_ALLOWED_ORIGINS`.

## 📚 Użyte technologie

### Backend
- **Django 4.2+** - Framework webowy
- **Django REST Framework** - API REST
- **Stripe** - Płatności testowe
- **Google OAuth** - Autoryzacja
- **SQLite** - Baza danych (development)

### Frontend
- **React 18** - Biblioteka UI
- **Material-UI** - Komponenty UI
- **Stripe.js** - Integracja płatności
- **Axios** - Klient HTTP

## 🤝 Współpraca

1. **Fork** repozytorium
2. Utwórz branch dla nowej funkcjonalności 
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** zmiany 
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** do brancha 
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Otwórz **Pull Request**

## 📄 Licencja

Ten projekt jest licencjonowany na licencji MIT - zobacz plik [LICENSE](LICENSE) po szczegóły.

## 👨‍💻 Autor

**Jan Fabisiak** - [jfabis](https://github.com/jfabis)

## 🙏 Podziękowania

- Zespół Django za wspaniały framework
- Stripe za łatwe w użyciu API płatności
- Google za OAuth API
- Społeczność open source za inspirację

---

⚠️ **Uwaga**: Ta aplikacja używa tylko testowych płatności. Żadne prawdziwe transakcje finansowe nie są przetwarzane.
