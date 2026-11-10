/******************************************************************************

Acquisire da tastiera una successione di due interi che termina 
con due interi positivi. Si consideri i due interi positivi acquisiti 
come il dividendo ed il divisore di una divisione.
Visualizzare il quoziente intero della divisione.
*******************************************************************************/
#include <stdio.h>

int main(void)
{
    int num1, num2, quoziente;
    do {
        printf ("num1 ----> ");
        scanf ("%d", &num1);
        printf ("num2 ----> ");
        scanf ("%d", &num2);
    } while (num1 <= 0 || num2 <= 0);
    
    quoziente = num1 / num2;
    
    printf("quoziente: %d", quoziente);
    
    return 0;
}
