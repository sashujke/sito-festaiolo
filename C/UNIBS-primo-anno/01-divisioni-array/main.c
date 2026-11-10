/******************************************************************************

Acquisire da tastiera 5 volte due numeri naturali. 
Si considerino i naturali acquisiti come il dividendo ed il divisore 
di una divisione. Dopo avere acquisito tutti i naturali,
visualizzare il quoziente intero ed il resto di ciascuna divisione.

*******************************************************************************/
#include <stdio.h>
#define DIM 5

int main(void)
{
    int x[DIM];
    int y[DIM];
    
    for (int i=0; i<DIM; i++){
        printf ("Inserisci due numeri naturali: ");
        scanf ("%d%d", &x[i],&y[i]);
    }
    
     for (int i=0; i<DIM; i++){
      printf ("\nRisultato %d\n", i);
      if (y[i] == 0) {
          printf ("Divisione non possibile: il divisore non puo essere zero.\n");
          continue;
      }
      int quoziente = x[i] / y[i];
      int resto = x[i] % y[i];
      printf ("Quoziente: %d", quoziente);
      printf ("\nResto: %d\n", resto);
    }
    return 0;
}
