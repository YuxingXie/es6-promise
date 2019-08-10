## 参考自《ES6标准入门》第十六章

研究Promise的动机在于解决一个业务问题。在angular框架中，我希望通过post或get请求访问API，在获得API异步返回的结果之前，页面都需要
一个遮罩层显示正在获取数据，获得数据后遮罩层消失。我希望Promise可以解决我的问题。

### 1. Promise的含义

所谓Promise,就是一个对象，用来传递异步操作的消息。它代表了某个未来才会知道结果的事件(通常是一个异步操作)，并且这个事件提供统一的API，
可供进一步处理。

稍作理解，假设我们有如下代码：
```javascript
    const a= doSomethingA();
    const b = doSomethingB(a);
    const c = doSomethingC(b);
```
以上代码中三个doSomething方法在同步执行顺序逻辑下是可以执行的。然而，这些方法中的任何一个如果需要在一个异步操作进程中进行，
则无法进行下去。

基于这样一个事实：根据异步函数的机制，异步函数无法返回值(即便你写了return语句，它可能返回一个不是你想像的结果)，必须使用回调的方式，
所以异步函数需要使用到另外一个异步操作的结果的话，就必须把函数传到另一个函数里面去，就像:
```javascript
    doSomethingA(doSomethingB,doSomethingC);
```


#### 1.1. Promise对象的两个特性

1. 对象的状态不受外界影响

Promise对象代表一个异步操作，有3中状态：
* Pending(进行中)
* Resolved(已完成，又称Fulfilled)
* Rejected(已失败)

只有<B>异步操作的结果</B>可以决定当前是哪一种状态，任何其它操作都无法改变这个状态。这也是"Promise"这个名字的由来，它在英语中的意思就是
"承诺"，表示其它手段无法改变。

2. 一旦状态改变就不会再变，任何时候都可以得到这个结果

其实只有两种可能的变化：
* Pending --> Resolved
* Pending --> Rejected

这种变化一旦发生，状态就凝固了，不会再变,会一直保持这个结果。
```text
此段暂不是很理解：
就算改变已经发生，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件(Event)完全不同。事件的特点是，如果你错过了它，再去监听
是得不到结果的。
```
有了Promise对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。

此外，Promise对象提供统一的接口，使得控制异步操作更加容易。

#### 1.2. 基本用法

实例化Promise:
```javascript
    var promise = new Promise(function(resolve, reject) {
        // ... some code
        if(/* 异步操作成功 */){
            resolve(value);
        }else{
            reject(error);
        }
    });
```

感觉开始烧脑了，慢慢来理解。

不如我们的眼光放高一点，想像我们要自己设计一个和Promise类似的类。我们再想像一个日常的场景，比如煮咖啡，等咖啡煮好了喝掉。

我们不能写这样的代码，因为煮咖啡要5分钟时间,不可写成如下的同步方式：

```javascript
    makeCoffee();
    drinkCoffee();
```
结合我们学到的概念，煮咖啡从开始(pending)到结束(resolved或rejected)的过程，我们可以把煮咖啡这一步耗时5分钟的操作抽象为一个Promise。
煮咖啡的产物，可能是一杯咖啡(coffee if resolved)，或者是一杯焦炭(Coke powder if rejected)。

我尝试写如下代码表达我的意思：
```javascript
    var mkCoffee=new Promise(function(resolve,reject) {
        makeCoffee().result( coffeeOrCokePowder => {
            if (coffeeOrCokePowder==='coffee'){
                resolve('coffee');
            } else {
                reject('cokePowder');
            }
        });      
    });
```

现在我清晰了一些，但仍然不明白resolve和reject要拿我煮咖啡的产品来干什么。

按照我自己定义的场景，如果产品是咖啡，即resolved，我应该把它喝掉：
```javascript
// 我不想要resolve('coffee')，我是要：
    drink('coffee');//喝掉
```
否则扔掉:
```javascript
// 我不想要reject('cokePowder')，我是要：
    pourOff('cokePowder');//倒掉
```

