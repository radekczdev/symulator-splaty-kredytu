# Kredyt Symulator

Aplikacja Angular do symulacji harmonogramu spłaty kredytu, z wizualizacją ECharts.

## Jak uruchomić aplikację w Dockerze

### 1. Zbuduj obraz Dockera

W katalogu głównym projektu uruchom:
```bash
docker build -t kredyt-symulator .
```

### 2. Uruchom kontener z mapowaniem portów

Aby aplikacja była dostępna pod adresem [http://localhost:8181](http://localhost:8181), uruchom:
```bash
docker run -p 8181:80 kredyt-symulator
```

- `-p 8181:80` oznacza, że port 80 w kontenerze (gdzie działa aplikacja) jest dostępny na porcie 8181 Twojego komputera.
- Po uruchomieniu przejdź do przeglądarki i wpisz:  
  [http://localhost:8181](http://localhost:8181)

### 3. Zatrzymanie kontenera

Aby zatrzymać działający kontener, naciśnij `Ctrl+C` w terminalu, w którym został uruchomiony, lub użyj:
```bash
docker ps # znajdź ID lub nazwę kontenera
docker stop <CONTAINER_ID>
```

### 4. Uruchomienie w tle

Aby uruchomić kontener w tle, dodaj flagę `-d`:
```bash
docker run -d -p 8181:80 kredyt-symulator
```

---

**Podsumowanie:**  
Po wykonaniu powyższych kroków aplikacja będzie dostępna pod adresem [http://localhost:8181](http://localhost:8181).
`
