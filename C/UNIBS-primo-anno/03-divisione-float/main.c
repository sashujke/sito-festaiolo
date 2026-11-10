#include <stdio.h>

int main(void)
{
    float x1, x2;

    // Chiedi e leggi il primo numero
    printf("Inserisci il numero x1: ");
    scanf("%f", &x1);

    // Chiedi e leggi il secondo numero
    printf("Inserisci il numero x2: ");
    scanf("%f", &x2);

    if (x2 == 0.0f) {
        printf("Impossibile dividere per zero.\n");
        return 1;
    }

    // Calcolo della divisione
    float divisione = x1 / x2;

    // Estrazione parte intera e parte decimale/resto
    int parteIntera = (int)divisione;
    float parteDecimale = divisione - parteIntera;

    // Stampa del risultato
    printf("La parte intera e': %d, La parte decimale e': %.2f\n", parteIntera, parteDecimale);

    return 0;
}
