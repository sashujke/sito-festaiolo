/******************************************************************************

Acquisire un numero naturale n e visualizzare una piramide di naturali 
tale per cui la piramide ha n righe e la i-esima riga della piramide è costituita da i cifre uguali ad i. Ad
esempio per n = 3 si vuole visualizzare:
22
333
*******************************************************************************/
#include <stdio.h>

int main(void)
{
    int n1,n2;
    int quoziente = 0;
    int resto = 0;
    int DIM = 5;
    for (int i=1; i <= DIM; i++) {
        printf ("Inserisci numero naturale ---> ");
        scanf ("%d", &n1);
         printf ("\nInserisci numero naturale ---> ");
        scanf ("%d", &n2);
        if (n2 == 0) {
            printf ("\nImpossibile dividere per zero.\n");
            continue;
        }
        quoziente = n1 / n2;
        printf ("\nQuoziente intero: %d", quoziente);
        resto = n1 % n2; 
        printf ("\nResto: %d\n", resto);
        
    }
    return 0;
}
