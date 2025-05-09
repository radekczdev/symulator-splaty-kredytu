# Kredyt Symulator

Aplikacja Angular do symulacji harmonogramu spłaty kredytu, z wizualizacją ECharts.

## Jak uruchomić aplikację w Dockerze

### 1. Zbuduj obraz Dockera

W katalogu głównym projektu uruchom:
docker build -t kredyt-symulator .

text

### 2. Uruchom kontener z mapowaniem portów

Aby aplikacja była dostępna pod adresem [http://localhost:8181](http://localhost:8181), uruchom:
docker run -p 8181:80 kredyt-symulator

text

- `-p 8181:80` oznacza, że port 80 w kontenerze (gdzie działa aplikacja) jest dostępny na porcie 8181 Twojego komputera.
- Po uruchomieniu przejdź do przeglądarki i wpisz:  
  [http://localhost:8181](http://localhost:8181)

### 3. Zatrzymanie kontenera

Aby zatrzymać działający kontener, naciśnij `Ctrl+C` w terminalu, w którym został uruchomiony, lub użyj:
docker ps # znajdź ID lub nazwę kontenera
docker stop <CONTAINER_ID>

text

### 4. Uruchomienie w tle

Aby uruchomić kontener w tle, dodaj flagę `-d`:
docker run -d -p 8181:80 kredyt-symulator

text

---

**Podsumowanie:**  
Po wykonaniu powyższych kroków aplikacja będzie dostępna pod adresem [http://localhost:8181](http://localhost:8181).
