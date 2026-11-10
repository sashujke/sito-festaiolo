/******************************************************************************

Acquisire un numero naturale n e visualizzare una piramide di naturali 
tale per cui la piramide ha n righe e la i-esima riga 
della piramide è costituita da i cifre uguali ad i. 
Ad esempio per n = 3 si vuole visualizzare:
1
22
333
*******************************************************************************/

#include <stdio.h>

int main(void)
{
    int n;
    printf ("un numero naturale n ---> ");
    scanf ("%d", &n);
    for (int i=1; i <= n; i++) {
        for (int j=1; j <= i; j++) {
        printf ("%d", i);
        }
      printf ("\n");
    }

    return 0;
}
