var data = {
    name: 'silvia',
    age: 18
}

const weakMap = new WeakMap();

function track(target, key) {

    if (!activeEffect) return
    
    let depsMap = weakMap.get(target)

    if (!depsMap) {
        weakMap.set(target, depsMap = new Map())
    }

    let dep = depsMap.get(key)

    if (!dep) {
        depsMap.set(key, dep = new Set())
    }
    
    dep.add(activeEffect)
}

function trigger(target, key) {
    let depsMap = weakMap.get(target)
    if (depsMap) {
        let dep = depsMap.get(key)
        if (dep) {
            dep.forEach(effect => effect())
        }
    }
}

let activeEffect;
function effect(fn) {
    activeEffect = fn;
    activeEffect();
    activeEffect = null
}

function reactive(target) {
    var handler = {
        get(target, key, receiver) {
            track(target, key)
            return Reflect.get(target, key, receiver)
        },
        set(target, key, value, receiver) {
            trigger(target, key);
            return Reflect.set(target, key, value, receiver)
        }
    }
    return new Proxy(target, handler)
}

function ref(initValue) {
    return reactive({
        value: initValue
    })
}

function computed(fn) {
    const result = ref();
    effect(() => result.value = fn())

    return result
}

let num1 = ref(5)
let num2 = ref(8)
let sum1 = computed(() => num1.value * num2.value)
let sum2 = computed(() => sum1.value * 10)

console.log(sum1.value) // 40
console.log(sum2.value) // 400

num1.value = 10

console.log(sum1.value) // 80
console.log(sum2.value) // 800

num2.value = 16

console.log(sum1.value) // 160
console.log(sum2.value) // 1600

const obj1 = {
    name: 'silvia',
    age: 18
}

const arr1 = [ 'silvia', 'ruirui', 'momo' ];

for (let key in arr1) {
    console.log(key);
}
for (let k of arr1) {
    console.log(k);
}

let map = new Map()

map.set('aaaa', '1111111')
map.set('bbbbb', '222222')

map.forEach((value, key) => {
    console.log(value, key);
})

