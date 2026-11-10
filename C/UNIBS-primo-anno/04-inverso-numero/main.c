/******************************************************************************

Acquisire un numero per vedere se il suo inverso è più grande 
*******************************************************************************/
#include <stdio.h>

int main(void)
{
    int n, n_inv = 0, resto, n_saved;
    
    printf("-----> ");
    scanf("%d", &n);
    
    n_saved = n; 
    
    while (n > 0) {
        resto = n % 10;
        n = n / 10;
        n_inv = n_inv * 10 + resto;
    }
    
    if (n_inv > n_saved) {
        printf("%d è maggiore di %d \n", n_inv, n_saved);
    }
    
    return 0;
}
