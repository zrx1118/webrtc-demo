// var data = {
//     name: 'silvia',
//     age: 18
// }

// const weakMap = new WeakMap();

// function track(target, key) {

//     if (!activeEffect) return
    
//     let depsMap = weakMap.get(target)

//     if (!depsMap) {
//         weakMap.set(target, depsMap = new Map())
//     }

//     let dep = depsMap.get(key)

//     if (!dep) {
//         depsMap.set(key, dep = new Set())
//     }
    
//     dep.add(activeEffect)
// }

// function trigger(target, key) {
//     let depsMap = weakMap.get(target)
//     if (depsMap) {
//         let dep = depsMap.get(key)
//         if (dep) {
//             dep.forEach(effect => effect())
//         }
//     }
// }

// let activeEffect;
// function effect(fn) {
//     activeEffect = fn;
//     activeEffect();
//     activeEffect = null
// }

// function reactive(target) {
//     var handler = {
//         get(target, key, receiver) {
//             track(target, key)
//             return Reflect.get(target, key, receiver)
//         },
//         set(target, key, value, receiver) {
//             trigger(target, key);
//             return Reflect.set(target, key, value, receiver)
//         }
//     }
//     return new Proxy(target, handler)
// }

// function ref(initValue) {
//     return reactive({
//         value: initValue
//     })
// }

// function computed(fn) {
//     const result = ref();
//     effect(() => result.value = fn())

//     return result
// }

// let num1 = ref(5)
// let num2 = ref(8)
// let sum1 = computed(() => num1.value * num2.value)
// let sum2 = computed(() => sum1.value * 10)

// console.log(sum1.value) // 40
// console.log(sum2.value) // 400

// num1.value = 10

// console.log(sum1.value) // 80
// console.log(sum2.value) // 800

// num2.value = 16

// console.log(sum1.value) // 160
// console.log(sum2.value) // 1600

// const obj1 = {
//     name: 'silvia',
//     age: 18
// }

// const arr1 = [ 'silvia', 'ruirui', 'momo' ];

// for (let key in arr1) {
//     console.log(key);
// }
// for (let k of arr1) {
//     console.log(k);
// }

// let map = new Map()

// map.set('aaaa', '1111111')
// map.set('bbbbb', '222222')

// map.forEach((value, key) => {
//     console.log(value, key);
// })


// console.log(fun) // function fun() {}
// function fun() {}

// if (false) {
//   function fun2(){}
// }
// console.log(fun2) // undefined 不会报错

// console.log(fun) // function fun() {}
// var fun = 'Sunshie_Lin'
// function fun() {}
// console.log(fun) // 'Sunshie_Lin'

// let a = isNaN('dddd'),
//     b = Number.isNaN('dddd');
// console.log(a, b);


let Person = {
    name: 'Tom',
    say(params) {
        console.log(this)
        console.log(`我叫${this.name}`)
        console.log(`params:${params}`)
    }
}

// 先看代码执行效果
Person.say() //我叫Tom 
let Person1 = {
    name: 'Tom1'
}

Function.prototype.myCall = function(context, ...params) {
    console.log(this);
    if (context === null || context === 'undefined') {
        context = window
    } else {
        context = Object(context)
    }

    let myProperty = Symbol('myProperty')
    context[myProperty] = this;
    let result = context[myProperty](params);

    delete context[myProperty]
    return result
}

Person.say.myCall(Person1, 'silvia', 'ruirui')



Function.prototype.myApply = function(context, ...params) {
    console.log(this);
    if (context === null || context === 'undefined') {
        context = window
    } else {
        context = Object(context)
    }

    let unique = (Math.random() + new Date().getTime()).toString(32).slice(0, 8)
    let myProperty = Symbol(unique)
    context[myProperty] = this;
    let arg = [...arguments].slice(1);
    let result = context[myProperty](arg);

    delete context[myProperty]
    return result
}

Function.prototype.myBind = function(context) {
    let self = this;
    let args = [...arguments].slice(1);
    return function() {
        let params = [...arguments];

        return self.apply(context, args.concat(params))
    }
}

let pp = Person.say.myBind(Person1);
pp('1111silvia')
pp('ruiruiruirui')
Person.say.myApply(Person1, ['silvia', 'ruirui'])

/**
 * 将函数柯里化
 * @param fn    待柯里化的原函数
 * @param len   所需的参数个数，默认为原函数的形参个数
 */
function curry(fn, len = fn.length) {
    return _curry.call(this, fn, len)
}

/**
 * 中转函数
 * @param fn    待柯里化的原函数
 * @param len   所需的参数个数
 * @param args  已接收的参数列表
 */
function _curry(fn, len, ...args) {
    return function (...params) {
        let _args = [...args, ...params];
        if(_args.length >= len){
            return fn.apply(this, _args);
        }else{
            return _curry.call(this, fn, len, ..._args)
        }
    }
}

let _fn = curry(function(a,b,c,d,e){
    console.log(a,b,c,d,e)
});

_fn(1,2,3,4,5);     // print: 1,2,3,4,5
_fn(1)(2)(3,4,5);   // print: 1,2,3,4,5
_fn(1,2)(3,4)(5);   // print: 1,2,3,4,5
_fn(1)(2)(3)(4)(5); // print: 1,2,3,4,5


for (var i = 0; i < 5; i++) {
    setTimeout(() => {
        console.log('i', i);
    }, 0);

    (function(j) {
        setTimeout(() => {
            console.log('j', j);
        }, 0)
    })(i)
}