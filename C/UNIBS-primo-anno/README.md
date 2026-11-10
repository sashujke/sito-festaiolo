# C — UNIBS primo anno

Esercizi introduttivi in C organizzati per argomento e numerati in ordine
progressivo. Ogni cartella contiene un `main.c` autonomo.

## Esercizi

| Cartella | Argomento | Origine |
| --- | --- | --- |
| `01-divisioni-array` | Cinque divisioni con quoziente e resto | `10-11 compito` |
| `02-divisioni-resto-zero` | Visualizzazione dei quozienti con resto zero | `11-10 compito` |
| `03-divisione-float` | Parte intera e decimale di una divisione reale | `es1` |
| `04-inverso-numero` | Confronto tra numero e numero invertito | `Esercizio 3` |
| `05-divisione-positivi` | Divisione tra interi positivi | `Esercizio4` |
| `06-quoziente-sottrazioni` | Quoziente calcolato con sottrazioni | `Esercizio5` |
| `07-piramide-naturali` | Piramide di cifre naturali | `Esercizio6` |
| `08-somma-doppi` | Somma del doppio degli interi in un intervallo | `Esercizio7` |
| `09-divisione-con-controllo` | Divisione con controllo del divisore nullo | `Homework2` |
| `10-divisioni-ripetute` | Cinque divisioni con quoziente e resto | `Homework3` |
| `11-parte-frazionaria` | Parte intera e frazionaria di un reale | `numero float` |

## Compilazione

Da una cartella di esercizio:

```bash
clang -std=c17 -Wall -Wextra -Wpedantic main.c -o esercizio
./esercizio
```

Gli esercizi organizzati qui sono copie sistemate dei file originali presenti
nella cartella universitaria locale; gli originali non vengono modificati.
