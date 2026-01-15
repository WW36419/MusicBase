# Music Base

### Testowanie i Jakość Oprogramowania
#### Autor: Wiktor Wojtanowski

## Opis

Music Base jest aplikacją internetową przeznaczoną do przeglądania oraz wyszukiwania danych muzycznych, takich jak piosenki, artyści i albumy. System umożliwia użytkownikom interakcję z bazą danych muzycznych poprzez intuicyjny interfejs webowy.

Aplikacja oferuje następujące funkcjonalności:
* wyszukiwanie oraz przeglądanie informacji o piosenkach, artystach i albumach,
* rejestrację użytkowników oraz logowanie do systemu,
* dodawanie wybranych piosenek do listy ulubionych,
* panel administracyjny umożliwiający zarządzanie danymi muzycznymi (dodawanie oraz usuwanie rekordów).

## Wymagania

* [Node.js i NPM](https://nodejs.org/en/download)
* [Docker](https://www.docker.com/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Google Chrome](https://www.google.com/intl/pl/chrome/) (do testów)

## Uruchomienie projektu

1. Uruchom Docker i Visual Studio Code.

2. W Visual Studio Code zainstaluj rozszerzenie "Docker".

3. Otwórz folder projektu w VSCode i w nim otwórz "docker-compose.yaml".

4. Przeciągni kursor na zawartość kodu, kliknij prawym przyciskiem myszy i wybierz "Compose Up". Poczekaj, aż wszystkie kontenery będą skomponowane.

5. Przejdź do [tego linku](http://localhost:4200/). Strona powinna się wyświetlać w takiej postaci:

![Music Base Homepage](./doc_img/zdj1.png)


## Testy

Testy jednostkowe i integracyjne zostały zaimplementowane dla 11 komponentów w Angularze. Poza domyślnie wygenerowanymi testami, utworzono razem 25 testów jednostkowych oraz 20 testów integracyjnych.
Testy weryfikują poprawność logiki komponentów, integrację z serwisami oraz nawigację pomiędzy widokami aplikacji.

### [Top10SongsAllComponent](./Frontend/src/app/components/top10-songs-all/top10-songs-all.component.spec.ts)

Komponent odpowiedzialny za wyświetlanie listy dziesięciu najpopularniejszych piosenek zapisanych w lokalnej bazie danych.

* Testy jednostkowe:
    * "should load song data" - weryfikuje poprawność pobierania danych piosenek.
    * "should transform artist list" - sprawdza, czy lista artystów piosenki jest poprawnie przetwarzana do czytelnego foramtu w interfejsie.
* Testy integracyjne:
    * "should display song info when song item is shown" - weryfikuje poprawne przekazanie danych do komponentu SongItemComponent oraz ich prawidłowe wyświetlenie.


### [SongItemComponent](./Frontend/src/app/components/song-item/song-item.component.spec.ts)

Komponent karty piosenki, wyświetlający nazwę piosenki, listę artystów oraz zdjęcie albumu lub artysty.

* Testy jednostkowe:
    * "should get image url from album id" - sprawdza, czy komponent poprawnie pobiera adres URL zdjęcia na podstawie identyfikatora albumu.
    * "should get image url from artist id as replacement for album id" - weryfikuje mechanizm zastępczy, w którym zdjęcie artysty jest pobierane w przypadku braku zdjęcia albumu.
* Testy integracyjne:
    * sprawdza poprawność nawigacji do strony szczegółów piosenki (/song/{song_id}) po kliknięciu karty.


### [SongDetailsComponent](./Frontend/src/app/components/song-details/song-details.component.spec.ts)

Komponent strony szczegółów piosenki, prezentujący pełne informacje na temat wybranego utworu.

* Testy jednostkowe:
    * "should load song id" - weryfikuje poprawne odczytanie identyfikatora piosenki z parametrów trasy.
    * "should load song details" - sprawdza poprawność pobierania szczegółowych danych piosenki.
    * "should transform artist list" - sprawdza, czy lista artystów piosenki jest poprawnie przetwarzana do czytelnego foramtu w interfejsie.
    * "should load album name" - sprawdza poprawność pobierania nazwy albumu przypisanego do piosenki.
    * "should check if song is in favourites" - weryfikuje sprawdzanie, czy piosenka znajduje się na liście ulubionych użytkownika.
* Testy integracyjne:
    * "should navigate to artist page when artist name is clicked" - sprawdza poprawność nawigacji do strony szczegółów artysty (/artist/{artist_id}) po kliknięciu jego nazwy.
    * "should navigate to album page when album name is clicked" - weryfikuje poprawność przejścia do strony szczegółów albumu (/album/{album_id}) po kliknięciu jego nazwy.


### [AlbumDetailsComponent](./Frontend/src/app/components/album-details/album-details.component.spec.ts)

Komponent strony szczegółów albumu, prezentujący pełne informacje na temat wybranego albumu.

* Testy jednostkowe:
    * "should load album id" - weryfikuje poprawne odczytanie identyfikatora albumu z parametrów trasy.
    * "should load album details" - sprawdza poprawność pobierania szczegółowych danych albumu.
    * "should load album tracks" - sprawdza poprawność pobierania listy piosenek w albumie.
    * "should transform artist list" - sprawdza, czy lista artystów piosenki jest poprawnie przetwarzana do czytelnego foramtu w interfejsie.
* Testy integracyjne:
    * "should navigate to artist page when artist name is clicked" - sprawdza poprawność nawigacji do strony szczegółów artysty (/artist/{artist_id}) po kliknięciu jego nazwy.
    * "should navigate to song page when track card is clicked" - sprawdza poprawność nawigacji do strony szczegółów piosenki (/song/{song_id}) po kliknięciu jego nazwy.


### [ArtistDetailsComponent](./Frontend/src/app/components/artist-details/artist-details.component.spec.ts)

Komponent strony szczegółów artysty, prezentujący pełne informacje na temat wybranego artysty.

* Testy jednostkowe:
    * "should load artist id" - weryfikuje poprawne odczytanie identyfikatora artysty z parametrów trasy.
    * "should load artist details" - sprawdza poprawność pobierania szczegółowych danych artysty.
    * "should load artist's album data" - sprawdza poprawność pobierania listy albumów należących do artysty.
    * "should load artist's song data" - sprawdza poprawność pobierania listy piosenek należących do artysty.
* Testy integracyjne:
    * "should navigate to album page when album card is clicked" - weryfikuje poprawność przejścia do strony szczegółów albumu (/album/{album_id}) po kliknięciu jego nazwy.
    * "should navigate to song page when song card is clicked" - sprawdza poprawność nawigacji do strony szczegółów piosenki (/song/{song_id}) po kliknięciu jego nazwy.


### [SearchBarComponent](./Frontend/src/app/components/search-bar/search-bar.component.spec.ts)

Komponent odpowiedzialny za wyszukiwanie piosenek, albumów oraz artystów na podstawie wprowadzonej kwerendy.

* Testy jednostkowe:
    * "should load searched album cards when album query is given" - weryfikuje poprawność pobierania i przetwarzania wyników wyszukiwania albumów na podstawie podanej kwerendy.
    * "should load searched song cards when song query is given" - sprawdza, czy komponent poprawnie ładuje i wyświetla wyniki wyszukiwania piosenek.
    * "should load searched artist cards when artist query is given" - weryfikuje poprawność pobierania danych artystów w odpowiedzi na zapytanie wyszukiwania.
* Testy integracyjne:
    * "should display card info when song cards are shown" - sprawdza poprawne przekazanie danych do komponentów kart (CardItemComponent) oraz ich prawidłowe wyświetlenie w interfejsie użytkownika.


### [CardItemComponent](./Frontend/src/app/components/card-item/card-item.component.spec.ts)

Komponent karty zawierająca informacje o danym typie muzyki (piosenka, album lub artysta). Kliknięcie w nią przekierowuje do strony szczegółów danego typu muzyki.

* Testy integracyjne:
    * "should navigate to album details page when album card is clicked" - weryfikuje poprawność przejścia do strony szczegółów albumu (/album/{album_id}) po kliknięciu karty.
    * "should navigate to song details page when song card is clicked" - sprawdza poprawność nawigacji do strony szczegółów piosenki (/song/{song_id}) po kliknięciu karty.
    * "should navigate to artist details page when artist card is clicked" - sprawdza poprawność nawigacji do strony szczegółów artysty (/artist/{artist_id}) po kliknięciu karty.


### [NavbarComponent](./Frontend/src/app/components/navbar/navbar.component.spec.ts)

Komponent paska nawigacyjnego umożliwiający użytkownikowi poruszanie się pomiędzy kluczowymi sekcjami aplikacji.

* Testy jednostkowe:
    * "should log out when logout button is clicked" - weryfikuje poprawność wylogowania użytkownika po kliknięciu przycisku wylogowania.
* Testy integracyjne:
    * "should navigate to home page when homepage button is clicked" - weryfikuje poprawne przejście do strony głównej aplikacji (/).
    * "should navigate to favourites page when favourites button is clicked" - sprawdza poprawność nawigacji do strony ulubionych piosenek użytkownika (/favourites).
    * "should navigate to admin panel when admin button is clicked" - sprawdza poprawność nawigacji do panelu administracyjnego (/admin).
    * "should navigate to sign up page when signup button is clicked" - sprawdza poprawność nawigacji do strony rejestracji użytkownika (/signup).
    * "should navigate to login page when login button is clicked" - weryfikuje poprawne przejście do strony logowania (/login).


### [SignupComponent](./Frontend/src/app/components/signup/signup.component.spec.ts)

Komponent strony rejestracji, umożliwiający użytkownikowi założenie nowego konta w aplikacji.

* Testy integracyjne:
    * "should navigate to homepage after signup" - weryfikuje poprawność przekierowania użytkownika na stronę główną (/) po pomyślnym utworzeniu konta.


### [LoginComponent](./Frontend/src/app/components/login/login.component.spec.ts)

Komponent strony logowania, odpowiedzialny za uwierzytelnianie użytkownika w aplikacji.

* Testy jednostkowe:
    * "should be logged in when authentication is successful" - sprawdza, czy komponent poprawnie ustawia stan zalogowania użytkownika po udanym procesie uwierzytelnienia.
    * "should not be logged in when authentication is unsuccessful" - weryfikuje, że w przypadku błędnych danych logowania stan zalogowania nie zostaje ustawiony.
* Testy integracyjne:
    * "should navigate to homepage when login is successful" - sprawdza poprawność przekierowania użytkownika na stronę główną (/) po pomyślnym zalogowaniu.


### [FavouritesComponent](./Frontend/src/app/components/favourites/favourites.component.spec.ts)

Komponent odpowiedzialny za wyświetlanie listy polubionych piosenek  przez użytkownika.

* Testy jednostkowe:
    * "should load favourite song info" - sprawdza poprawność pobierania danych ulubionej piosenki.
    * "should transform artist list" - sprawdza, czy lista artystów piosenki jest poprawnie przetwarzana do czytelnego foramtu w interfejsie.
* Testy integracyjne:
    * "should display song info when song item is shown" - weryfikuje poprawne przekazanie danych do komponentu SongItemComponent oraz ich prawidłowe wyświetlenie.



## Uruchamianie testów

Aby uruchomić wszystkie testy jednostkowe i integracyjne w projekcie należy uruchomić terminal w projekcie i wykonać następujące komendy:

```sh
cd Frontend
npm install
npm run test
```

Powinien wyskoczyć okno Chrome pokazujący wszystkie wykonane testy na wsystkich komponentach. Aby zamknąć okno, w terminalu wykonaj dwa razy "Ctrl+C".


## Dokumentacja API

### Frontend (Angular)

| Ścieżka | Komponent | Opis | Guard |
|-------|----------|------|-------|
| / | HomeComponent | Strona główna | — |
| /song/:id | SongDetailsComponent | Szczegóły piosenki | — |
| /album/:id | AlbumDetailsComponent | Szczegóły albumu | — |
| /artist/:id | ArtistDetailsComponent | Szczegóły artysty | — |
| /login | LoginComponent | Logowanie użytkownika | — |
| /signup | SignupComponent | Rejestracja | — |
| /favourites | FavouritesComponent | Ulubione piosenki | auth |
| /admin | AdminPanelComponent | Panel administracyjny | admin |

### Backend (Express)

[Dokumentacja w Swagger](http://localhost:3100/api-docs)


## Przypadki testowe dla testera manualnego

Testy manualne (Test Cases) znajdują się na tablicy [MusicBase_projekt](https://trello.com/b/cEUdgEzi/musicbaseprojekt) w Trello oraz w folderze "test_cases":

* [TC001 - Weryfikacja zawartości strony głównej](./test_cases/TC001.txt)
* [TC002 - Weryfikacja zawartości strony szczegółów piosenki](./test_cases/TC002.txt)
* [TC003 - Weryfikacja zawartości strony szczegółów albumu](./test_cases/TC003.txt)
* [TC004 - Weryfikacja zawartości strony szczegółów artysty](./test_cases/TC004.txt)
* [TC005 - Weryfikacja zawartości strony założenia konta](./test_cases/TC005.txt)
* [TC006 - Weryfikacja zawartości strony logowania](./test_cases/TC006.txt)
* [TC007 - Wyszukiwanie piosenek w sekcji wyszukiwania](./test_cases/TC007.txt)
* [TC008 - Wyszukiwanie albumów w sekcji wyszukiwania](./test_cases/TC008.txt)
* [TC009 - Wyszukiwanie artystów w sekcji wyszukiwania](./test_cases/TC009.txt)
* [TC010 - Przejście do strony szczegółów piosenki z wyników wyszukiwania](./test_cases/TC010.txt)
* [TC011 - Przejście do strony szczegółów piosenki z sekcji "Top 10 Najpopularniejszych Piosenek"](./test_cases/TC011.txt)
* [TC012 - Rejestracja nowego użytkownika](./test_cases/TC012.txt)
* [TC013 - Logowanie do konta użytkownika](./test_cases/TC013.txt)
* [TC014 - Wylogowanie użytkownika z aplikacji](./test_cases/TC014.txt)
* [TC015 - Dodawanie piosenki do listy ulubionych](./test_cases/TC015.txt)
* [TC016 - Usuwanie piosenki z ulubionych](./test_cases/TC016.txt)
* [TC017 - Logowanie do konta administratora](./test_cases/TC017.txt)
* [TC018 - Weryfikacja zawartości panelu administratora](./test_cases/TC018.txt)
* [TC019 - Weryfikacja obsługi niezgodnych haseł podczas rejestracji](./test_cases/TC019.txt)
* [TC020 - Nieudane logowanie użytkownika](./test_cases/TC020.txt)




## Technologie użyte w projekcie

* Angular – front-endowy framework rozwijany przez Google, wykorzystywany do tworzenia komponentowej aplikacji internetowej typu Single Page Application (SPA), zapewniający dwukierunkowe wiązanie danych, routing oraz rozbudowany system testów.

* Express.js – lekki framework back-endowy oparty na Node.js, używany do implementacji warstwy serwerowej aplikacji, obsługi żądań HTTP, logiki biznesowej oraz komunikacji z bazą danych.

* PostgreSQL – relacyjny system zarządzania bazą danych, wykorzystywany do przechowywania danych aplikacji, takich jak użytkownicy, piosenki, albumy, artyści oraz relacje pomiędzy nimi.

* Docker – narzędzie do konteneryzacji aplikacji, używane do uruchamiania środowiska projektu w izolowanych kontenerach, co zapewnia spójność konfiguracji oraz łatwe wdrażanie aplikacji.

* Jasmine – framework do testów jednostkowych w JavaScript, używany do pisania i uruchamiania testów komponentów oraz logiki aplikacji Angular.

* Karma – narzędzie do uruchamiania testów jednostkowych w przeglądarce, wykorzystywane jako test runner dla testów Jasmine w środowisku Angular.

* Node.js – środowisko uruchomieniowe JavaScript po stronie serwera, umożliwiające asynchroniczne przetwarzanie zapytań.

* TypeScript – statycznie typowany nadzbiór języka JavaScript, zwiększający czytelność kodu oraz bezpieczeństwo typów.
