/******************************************************************************

Scrivere un programma C che risolva il seguente problema.

Acquisire da tastiera 5 volte due numeri naturali. 
Si considerino i naturali acquisiti come il dividendo 
ed il divisore di una divisione. 
Dopo avere acquisito tutti i naturali e dopo avere 
calcolato tutti i quozienti interi e resti, visualizzare
il quoziente intero di ciascuna divisione con resto zero.
 
Si noti che la fase di elaborazione dei risultati è richiesta
essere completata prima della fase di visualizzazione degli stessi.

*******************************************************************************/
#include <stdio.h>
#define DIM 5

int main(void)
{
    int x[DIM], y[DIM];
    int quoziente[DIM], resto[DIM];
    
    for (int i=0; i < DIM; i++) {
        printf ("Inserisci due numeri naturali: ");
        scanf ("%d%d", &x[i], &y[i]);
        if (y[i] == 0) {
            quoziente[i] = 0;
            resto[i] = 1;
            continue;
        }
        quoziente[i] = x[i] / y[i];
        resto [i] = x[i] % y[i];
    }

    for (int i=0; i < DIM; i++) {
        if (resto[i] == 0) {
            printf ("\nQuoziente è: %d", quoziente[i]);
        }
      
    }
    return 0;
}
