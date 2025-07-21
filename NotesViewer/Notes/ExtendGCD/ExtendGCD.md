# 拓展歐幾里德的應用

作者: JimLin 最後編輯:2023/10/08

## 前言

貝祖等式滿足$ax+by=gcd(a, b)存在整數解(x, y)$

## 程式碼

```cpp
int exgcd(int a, int b, int& x, int& y)
{
    if (b == 0)
    {
        x = 1;
        y = 0;
        return a;
    }

    int gcd = exgcd(b, a % b, x, y);
    int y1 = y;
    y = x - (a / b) * y;
    x = y1;
    return gcd;
}
```

## 延伸

題目要求:解 $ax+by=n, a、b \in \mathbb{Z}^{0+}$

## 實際分析

已知題幹 $ax+by=n$ 滿足丟番圖方程式\
同時利用貝祖等式 $ax_1 + by_1 = gcd(a, b)$\
觀察兩式可知將 $ax_1 + by_1 = gcd(a, b)$ 兩邊乘上 $\frac{n}{gcd(a, b)}$\
得 $a\frac{nx_1}{gcd(a, b)} + b\frac{ny_1}{gcd(a, b)} = n$\
此時可看成 $x = \frac{nx_1}{gcd(a, b)}$，$y = \frac{ny_1}{gcd(a, b)}$\
可以找出一通解
$$x = \frac{nx_1}{gcd(a, b)} + k \times \frac{b}{gcd(a, b)}$$
$$y = \frac{ny_1}{gcd(a, b)} - k \times \frac{a}{gcd(a, b)}$$
$$k \in \mathbb{Z}$$
(以上通解帶回 $ax + by = n$會發現$k$會被消除)\
$由於x \geq 0，y \geq 0$

$$\begin{align}
    所以x = \frac{nx_1}{gcd(a, b)} + k \times \frac{b}{gcd(a, b)} \geq &0 \notag\\
    y = \frac{ny_1}{gcd(a, b)} - k \times \frac{a}{gcd(a, b)} \geq &0 \notag
\end{align}$$
經過移項運算可得
$$\frac{-nx_1}{b} \leq k \leq \frac{ny_1}{a}$$

## 例題

### [UVA 10090 Marbles](https://onlinejudge.org/index.php?option=onlinejudge&Itemid=8&page=show_problem&problem=1031)
題目要求$(x, y)$\
滿足$ax + by = n$\
使得$Cost = c_1x + c_2y最小$\
$a,b,c_1,c_2,x,y \in \mathbb{Z}^+$
#### 解題
利用通解\
$x = \frac{nx_1}{gcd(a, b)} + k \times \frac{b}{gcd(a, b)}$\
$y = \frac{ny_1}{gcd(a, b)} - k \times \frac{a}{gcd(a, b)}$\
$k \in \mathbb{Z}$
將通解帶入$Cost = c_1x + c_2y$
得
$$
\begin{align*}
    Cost &= c_1(\frac{nx_1}{gcd(a, b)} + k \times \frac{b}{gcd(a, b)}) + c_2(\frac{ny_1}{gcd(a, b)} - k \times \frac{a}{gcd(a, b)})\\
    &= \underbrace{(\frac{c_1nx_1}{gcd(a, b)} + \frac{c_2ny_1}{gcd(a, b)})}_{常數} + k \underbrace{(\frac{bc_1}{gcd(a, b)} - \frac{ac_2}{gcd(a, b)})}_{斜率}
\end{align*}
$$
$其中a,b,c_1,c_2是題目已知，x_1, y_1是用拓展歐幾里德得出的整數解$
$所以其實Cost是k的線性一次式$\
$如此一來利用\frac{-nx_1}{b} \leq k \leq \frac{ny_1}{a}可知k的上界與下界$\
$判斷Cost的斜率是正或負可知用k的上界或下界帶入得最小的Cost$
##### 無解的判斷
1. $n不被gcd(a, b)整除$
2. $k的上界 < k的下界$
#### 程式碼
```cpp
#include <iostream>
#include <cmath>
using namespace std;
#define ll long long

ll exgcd(ll a, ll b, ll& x, ll& y)
{
    if (b == 0)
    {
        x = 1;
        y = 0;
        return a;
    }
    ll gcd = exgcd(b, a % b, x, y);
    ll y1 = y;
    y = x - (a / b) * y;
    x = y1;
    return gcd;
}

int main()
{
    ll n;
    ll x, y;
    ll c1, c2, a, b;
    while (~scanf("%lld", &n) && n)
    {
        scanf("%lld %lld", &c1, &a);
        scanf("%lld %lld", &c2, &b);
        ll gcd = exgcd(a, b, x, y);
        if (n % gcd != 0)
        {
            printf("failed\n");
            continue;
        }
        ll l = ceil((double)(-n) * x / b);
        ll r = floor((double)(n) * y / a);
        if (l > r)
        {
            printf("failed\n");
            continue;
        }
        if (c1 * b < c2 * a) //斜率正or負
        {
            //斜率負，帶入k的上界
            x = n * x / gcd + b / gcd * r;
            y = n * y / gcd - a / gcd * r;
        }
        else
        {
            //斜率正，帶入k的下界
            x = n * x / gcd + b / gcd * l;
            y = n * y / gcd - a / gcd * l;
        }
        printf("%lld %lld\n", x, y);
    }
    return 0;
}
```