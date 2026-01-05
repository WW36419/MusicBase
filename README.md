# Music Base

#### Autor: Wiktor Wojtanowski

## Opis

Music Base jest aplikacją internetową do wyświetlania danych muzycznych - piosenek, artystów i albumów. 

Aplikacja zawiera następujące funkcjonalności:
- wyszukiwanie i przeglądanie danych muzycznych,
- utworzenie konta i logowanie,
- polubienie wybranych piosenek,
- panel administratora - możliwość zarządzania (dodawania / usunięcia) danymi muzycznymi.

## Wymagania

* [Node.js i NPM](https://nodejs.org/en/download)
* [Docker](https://www.docker.com/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Google Chrome](https://www.google.com/intl/pl/chrome/) (dla testów)

## Przygotowanie aplikacji

1. Uruchom Docker i Visual Studio Code.

2. W Visual Studio Code zainstaluj rozszerzenie "Docker".

3. Otwórz folder projektu w VSCode i w nim otwórz "docker-compose.yaml".

4. Przeciągni kursor na zawartość kodu, kliknij prawym przyciskiem myszy i wybierz "Compose Up". Poczekaj, aż wszystkie kontenery będą skomponowane.

5. Przejdź do [tego linku](http://localhost:4200/). Strona powinna się wyświetlać w takiej postaci:

![Music Base Homepage](./doc_img/zdj1.png)


## Testy

Testy jednostkowe i integracyjne są samodzienie wykonywane na 11 komponentach w Angularze.

Aby uruchomić wszystkie testy jednostkowe i integracyjne w projekcie należy uruchomić terminal w projekcie i wykonać następujące komendy:

```sh
cd Frontend
npm install
npm run test
```

Powinien aytomatycznie wyskoczyć okno Chrome pokazujący wszystkie wykonane testy na wsystkich komponentach.

Testy manualne (Test Cases) znajdują się na tablicy [MusicBase_projekt](https://trello.com/b/cEUdgEzi/musicbaseprojekt) w Trello.


## Używanie aplikacji

### Przeglądanie bazy muzycznej

1. Klikając na dowolną kartę piosenki (np. when the party's over), można zobaczyć dane tej konkretnej piosenki.

![Music Base Song Details](./doc_img/zdj2.png)

2. Można także kliknąć na nazwę twórcy (lub albumu) i zobaczyć ich dane. Na stronie konkretnej artysty można zobaczyć dominujący gatunek, najpopularniejsze utwory i wydane albumy.

![Music Base Artist Details](./doc_img/zdj3.png)

3. Na stronie głównej można także znaleźć 'search bar' wyszukującą dane muzyczne po podanej frazie. Wybierz, co chcesz szukać (piosenka, album, artysta) i po wpisaniu trzech pierwszych liter pojawiają się dane, którego nazwy są podobne do wpisanej frazy.

![Music Base Search Bar](./doc_img/zdj4.png)

4. Klikając na dany wynik, wykonuje się przejście do danej strony.

![Music Base Searched Song](./doc_img/zdj5.png)


### Logowanie i tworzenie konta

1. W menu nawigacji (na samej górze) znajdują się przycisk logowania i tworzenia konta. Aby utworzyć konto należy kliknąć w zakładkę 'Stwórz konto'.

2. Na stronie zakładania konta należy wprowadzić adres e-mail, hasło i nazwę użytkownika. Po ich wprowadzaniu należy kliknąć w 'Sign Up', by utworzyć konto.

![Music Base Sign In](./doc_img/zdj6.png)

3. Następnie należy przejść do logowania. Klikając na 'Zaloguj' w menu nawigacji, otworzy się strona logowania. Tam należy wprowadzić e-mail i hasło do konta, później kliknąć przycisk 'Zaloguj'.

![Music Base Log In](./doc_img/zdj7.png)

Przy prawidłowych danych aplikacja automatycznie przekieruje do menu startowego i w menu nawigacji pokazują się nowe przyciski: 
- 'Ulubione' - lista ulubionych piosenek,
- 'Wyloguj' - wylogowanie ze strony.


### Dodanie piosenki do ulubionych

1. Kliknij na wcześniejszą kartę piosenki. Teraz pojawia się przycisk 'Polub'.

![Music Base Fav Button](./doc_img/zdj8.png)

2. Kliknij przycisk 'Polub', a następnie przejdź do strony 'Favourites'. Tam będą zapisane piosenki, które były polubione.

![Music Base Favourites](./doc_img/zdj9.png)



### Panel administratora


1. Aby się dostać do panelu administratora, należy zalogować się jako administrator. Jak jesteś zalogowany, to się wyloguj (kliknij w zakładkę 'Wyloguj'). Przejdź do zakładki 'Zaloguj', wpisz następujące dane i zaloguj się.
- Email: admin@test.pl
- Hasło: admin

![Music Base Admin Login](./doc_img/zdj10.png)

2. Pojawi się na górze strony zakładka 'Panel Administratora'. Przejdź do niego.

![Music Base Admin Panel](./doc_img/zdj11.png)

Z panelu można dodawać i usuwać dane muzyczne (piosenki, albumy i artyści). Teraz spróbujemy dodać do bazy danych nową artystę wraz z piosenką i albumem.

3. Kliknij w 'Dodaj artystę'. Pojawi się formularz do wypełnienia. Wypełnij ten formularz danymi tak jak na obrazie poniżej:

![Music Base Add Artist](./doc_img/zdj12.png)

W razie wprowadzeniu złego gatunku odśwież stronę.

4. Kliknij przycisk 'Dodaj' - powinno przejść do strony nowo dodanej artysty. 

![Music Base Show New Artist](./doc_img/zdj13.png)

5. Przejdź do panelu administratora i kliknij 'Dodaj piosenkę'. Uzupełnij dane tak jak na obrazie poniżej:

![Music Base Add Song](./doc_img/zdj14.png)

6. Kliknij przycisk 'Dodaj' - powinno przejść do strony nowo dodanej piosenki.

7. Przejdź znowu do panelu administratora i kliknij 'Dodaj album'. Uzupełnij dane tak jak na obrazach poniżej:

![Music Base Add Album Part 1](./doc_img/zdj15.png)

![Music Base Add Album Part 2](./doc_img/zdj16.png)

Nie zapomnij dodać wcześniej utworzonego artysty i piosenki.

8. Kliknij przycisk 'Dodaj' - powinno przejść do strony nowo dodanego albumu.

![Music Base Added Album](./doc_img/zdj17.png)

9. Klikając w utwór 'Nr. 1 DNA (Loving You)' zobaczymy ostateczną stronę nowo dodanej piosenki.

![Music Base Added Song](./doc_img/zdj18.png)