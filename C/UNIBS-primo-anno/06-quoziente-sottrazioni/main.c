/******************************************************************************

Acquisire da tastiera una successione di due interi che termina
con due interi positivi. Si consideri gli interi acquisiti come il dividendo
ed il divisore di una divisione. Visualizzare il quoziente intero calcolato 
utilizzando esclusivamente operazioni di somma e sottrazione.
*******************************************************************************/
#include <stdio.h>

int main(void)
{
    int num1, num2;
    int contatore = 0;
    do {
        printf ("num1 ----> ");
        scanf ("%d", &num1);
        printf ("num2 ----> ");
        scanf ("%d", &num2);
    } while (num1 <= 0 || num2 <= 0);
    
    int resto = num1;

   while (resto >= num2) {
       resto = resto - num2;
       contatore++;
   }
   
   printf ("contatore: %d ", contatore);
    
    return 0;
}