# my-react

> Let’s build a React from scratch

- [1장 VirtualDOM & Renderer](https://geekpaul.medium.com/lets-build-a-react-from-scratch-part-1-virtualdom-and-renderer-14f4f716de62)
- [2장 State Management & Hooks](https://geekpaul.medium.com/lets-build-a-react-from-scratch-part-2-state-management-and-react-hooks-e771c5c06066)
- [3장 React Suspence & Concurrent Mode](https://geekpaul.medium.com/lets-build-a-react-from-scratch-part-3-react-suspense-and-concurrent-mode-5da8c12aed3f)
- [4장 Server Side Rendering](https://geekpaul.medium.com/lets-build-a-react-from-scratch-part-4-server-side-rendering-and-its-challenges-b7b87c84bbf)

# Part 1 — VirtualDOM and Renderer

- 개정: typescript 가 아닌 tsc 사용 해야함

```diff
-npx typescript --init
+npx tsc --init
```

- 하나의 스크립트로 묶기

```json
"dev": "tsc -w & npx serve ."
```

## Our First JSX

- React 를 만들어줌
- React.createElement 를 추가 해줌
- HTML tag 를 작성하면 가장 하위부터 상위로 태그 개수만큼 createElement 를 호출함

```tsx
const App = (
  <div draggable>
    <h2>Hello React!</h2>
    <p>I am a pargraph</p>
    <input type="text" />
  </div>
);
```

```js
['h2', null, 'Hello React!']
['p', null, 'I am a pargraph']
['input', {…}]
['div', {…}, undefined, undefined, undefined]
```

## Introducing Virtual DOM

- tree 의 복제본을 저장하기 위해 tag, props, children 을 분리해서 받음
- tag 가 fuction 인 경우 직접 실행해서 el 반환

## Let’s Render our VirtualDOM (renderer)

- `<div id="myapp"></div>` 을 virtual DOM 의 root node 로 잡고 실제 DOM 을 렌더링한다

1. 해당 type의 실제 DOM node 생성
2. props 복제
3. children 존재하는 경우 1~2 를 반복하여 현재 DOM 하위로 append
4. container.appendChild(domEl) 으로 브라우저 container 에 추가
5. Text node 의 경우 별도 처리 필요

## Lessons Learned

- 리액트 처음 배울때는 초고수들만 직접 만들기 하는줄 알아서 겁먹었는데 생각 보다 간단하다.
- 사실 JSX 가 너무 많은걸 해주는 것 같다. JSX 직접 만들기도 도전?
- virtual DOM 의 한계에 대한 글들이 요즘 많이 보이는데, signal 기반도 직접 만들기 해보면 좋을 것 같다

# Part 2 — State Management and React Hooks

## 🤹 Introduction to React Hooks (useState)🎪

- 초기값을 받아 state 와 setter 를 return

```ts
const useState = (initialState) => {
  console.log("useState is initialized with value:", initialState);
  let state = initialState;
  const setState = (newState) => {
    console.log("setState is called with newState value:", newState);
    state = newState;
  };
  return [state, setState];
};
```

## 🌗 Introducing Re-render for our App 🌝

- 모든 것을 다시 다 reRender 하기
  - onchange 마다 reRender 가 호출되고, useState 가 호출되면서 state 가 initialValue 로 reset 된다
  - redering 중에 새 값을 잃는다
  - 현재 render 함수는 append 만 수행

### reRender 시에 rootNode.innerHTML 초기화

```tsx
// ---- Library --- //
const reRender = () => {
  console.log("reRender-ing :)");
  const rootNode = document.getElementById("myapp");
  // reset/clean whatever is rendered already
  rootNode.innerHTML = "";
  // then render Fresh
  render(<App />, rootNode);
};
```

## 🍔 State-fulness and Global State Management 🍟

- state 를 useState 밖에 두고 변경되었는지 확인하자

```tsx
// ---- Library --- //
let myAppState;
const useState = (initialState) => {
  // Check before setting AppState to initialState (reRender)
  myAppState = myAppState || initialState;
  console.log("useState is initialized with value:", myAppState);
  const setState = (newState) => {
    console.log("setState is called with newState value:", newState);
    myAppState = newState;
    // Render the UI fresh given state has changed.
    reRender();
  };
  return [myAppState, setState];
};
```

## 👨🏻‍🎤 Managing Multiple States with useState() 😵‍💫

- library 의 저자로서 얼마나 많은 state 가 어디에 필요할 지 모른다
- 서로 다른 state 간에 overwrite 되어서는 안된다

- cursor 로 관리하는 globalArray 생성

```diff
// ---- Library --- //
+const myAppState = [];
+let myAppStateCursor = 0;

const useState = (initialState) => {
  // get the cursor for this useState
+ const stateCursor = myAppStateCursor;
  // Check before setting AppState to initialState (reRender)
+ myAppState[stateCursor] = myAppState[stateCursor] || initialState;
  console.log(
+   `useState is initialized at cursor ${stateCursor} with value:`,
    myAppState,
  );
  const setState = (newState) => {
    console.log(
+     `setState is called at cursor ${stateCursor} with newState value:`,
      newState,
    );
+   myAppState[stateCursor] = newState;
    // Render the UI fresh given state has changed.
    reRender();
  };
+ // prepare the cursor for the next state.
+ myAppStateCursor++;
+ console.log(`stateDump`, myAppState);
+ return [myAppState[stateCursor], setState];
};
```

- reRender 시에 myAppStateCursor 를 초기화

```diff
// ---- Library --- //
const reRender = () => {
  // ..
  rootNode.innerHTML = '';
+ // Reset the global state cursor
+ myAppStateCursor = 0;
  // then render Fresh
  render(<App />, rootNode);
};
```

## ✌🏽 Why the rules of React 🤞🏽

### Only Call Hooks at the Top Level

- state 관리를 위한 global array 존재
- 조건절이나 반복문 안에서 조건적으로 useState 와 같은 hook 이 호출된다면 cursor 추적하기가 어렵다

## Lessons Learned

- state 구현이 생각보다 쉬워서 놀랐다.
- diffing 처리는 별도로 안하는건지 여기서만 단순화 시킨 건지 궁금하다.
- multi state 처리할 때 꼭 cursor 를 별도로 둬야하나? map에대한 key 로 처리할 수는 없는지? 궁금하다

## Question

- 왜 input 의 onchange 를 정의 했는데도 우리가 흔히 하는 onChange 처럼 동작하지 않고 input 밖으로 포커스를 옮겨야만 반영되는것일까?

# Part 3 — React Suspense and Concurrent Mode

- React Suspense and Concurrent Mode

## 🦁 React Rendering Techniques 🐒

### Approach 1: Fetch-on-Render (not using Suspense)

- traditional way: fetching after the initial render
- state 와 같은 방식으로 채움

```jsx
function ProfilePage() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUser().then((u) => setUser(u));
  }, []);
  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline />
    </>
  );
}
```

- waterfall 단점: 의존된 데이터가 fetch 될 때마다 re-render 된다

### Approach 2: Fetch-Then-Render (not using Suspense)

- 컴포넌트에 대한 정보를 전용 function call 로 분리한다
- render 를 trigger 하기 위해서 setState 는 여전히 사용

```jsx
// Wrapping all data fetching
function fetchProfileData() {
  return Promise.all([fetchUser(), fetchPosts()]).then(([user, posts]) => {
    return { user, posts };
  });
}
// Using it in our Component
function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    promise.then((data) => {
      setUser(data.user);
      setPosts(data.posts);
    });
  }, []);
  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline posts={posts} />
    </>
  );
}
```

1. Start fetching
2. Finish fetching
3. Start rendering

- fetchProfileData 를 사용을 안하는데?

### Approach 3: Render-as-You-Fetch (using Suspense)

1. Start fetching
2. Start rendering
3. Finish fetching

- fetching 최적화 고려할 필요가 없다
  - fetching 완료되면 한번만 렌더링 하면 된다
- image, 다른페이지, 문서 등을 non-blocking 으로 가져올 수 있다

## 🦖 How does React Suspense Work? 🦇

- : React render cycle 에서 async call 을 처리하기 위한 메커니즘
- React 의 rendering 은 원래는 synchrounous
- renderer 는 VirtualDOM 에만 적용
- DOM 의 어떤 부분에 signal 을 주고 기다려야하는지 구분 필요
- 모든 promise 들을 추적해서 작업이 끝나면 자동으로 rendering 수행

## 🐙 What is Concurrent Mode 🦑

- 항상 부모-자식 구모가 아닌 경우를 처리하기 위해 try-catch block 의 컨셉을 차용하여 아직 로딩중인 VirtualDOM tree 정보를 전송

> Concurrent React 는 중단 가능한 rendering 이다

## 🦈 Our own little remote API 🐋

- simulate slow image fetching
- 현재는 promise 처리를 못하기때문에 아래 코드가 에러 나는게 맞다

```jsx
// ---- Remote API ---- //
const photoURL = 'https://picsum.photos/200';
const getMyAwesomePic = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(photoURL), 1500);
  });
};
//..
const App = () => {
//..
  const photo = getMyAwesomePic();
return (
      <h2>Our Photo Album</h2>
      <img src={photo} alt="Photo" />
// ..
```

## 🌳 Suspense and Caching mechanisms with 🌴 createResource

- createResource() 가 async call 을 추적

```jsx
// ---- Library ---- //
const resourceCache = {};
const createResource = (asyncTask, key) => {
  // First check if the key is present in the cache.
  // if so simply return the cached value.
  if (resourceCache[key]) return resourceCache[key];
  // If not then we need handle the promise here
  // ....
};
```

- resourceCache 에 async task 보관
- key 에 해당하는 resource 가 존재하면 해당 task 가 끝났다는 의미
- key 없으면? 아직 resolved 되지 않았으므로 렌더링 하면 안됨

## 💫 Branching our VirtualDOM creation 🐲

```diff
// ---- Library ---- //
const resourceCache = {};
const createResource = (asyncTask, key) => {
  // First check if the key is present in the cache.
  // if so simply return the cached value.
  if (resourceCache[key]) return resourceCache[key];
  // If not
+ throw { promise: asyncTask(), key };
};
```

- key 없으면 바로 throw 해버린다 -> virtual DOM tree 생성 중단

```jsx
// ---- Application --- //
const App = () => {
//..
  const photo = createResource(getMyAwesomePic, 'photo');
return (
//..
```

- 현재는 Uncaught error 나는게 정상

```tsx
// ---- Library --- //
const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      try {
        return tag(props, ...children);
      } catch ({ promise, key }) {
        console.log(promise);
        console.log(key);
      }
    }
    //..
  },
};
```

- catch 는 되었지만 여전히 Promise 어떻게 처리할 지 모름
- h2 로 간단한 fallback UI 를 만들어보자

```jsx
// ---- Library --- //
  createElement: (tag, props, ...children) => {
    //..
      } catch ({ promise, key }) {
        // We branch off the VirtualDOM here
        // now this will be immediately be rendered.
        return { tag: 'h2', props: null, children: ['loading your image'] };
```

## ☃️ Suspense in Action 💨

- promise 가 throw 된 경우 resourceCache 에 담아 추적
- 다음 번 loop 에서 resolved 되었다면 rerender 시에 반영됨

```tsx
// ---- Library --- //
  createElement: (tag, props, ...children) => {
        //..
      } catch ({ promise, key }) {
        // Handle when this promise is resolved/rejected.
        promise.then((value) => {
          resourceCache[key] = value;
          reRender();
        });
        //..
```

## 🥝 Conclusion 🥥

- 과제: 현재 구현으로는 resource 가 2 개 이상일 때 모든 resource 가 resolved 되어야 rendering 이 될 텐데 어떻게 병렬 처리를 할 것인가?

## Lessons Learned

- Concurrent React 는 중단 가능한 rendering 이다
  - try/catch 를 이런식으로 활용 할 줄은 몰랐는데.. 이건 업무로직에서도 활용 해볼 수 있을 것 같다
- Suspense 는 async call 을 처리하기 위한 메커니즘이다
  - 그냥 성능을 위한 부가 기능으로만 생각했던 Suspense 의 동작 방식을 살펴볼 수 있어 좋았다
- 단순한 구조의 resourceCache 만으로 Promise 를 추적할 수 있는게 흥미로웠지만,
  - 실제로는 더 복잡한 구조가 필요할 것 같다. eg) resource 가 실패했을 때 재시도 하는 로직

## Question

- [fetchProfileData](#approach-2-fetch-then-render-not-using-suspense) 예제는 오타인거 겠지?
- Cache 관련 고민해보아야 할 것들
  - Cache invalidation은 어떻게 처리하나요?
  - Memory leak 방지를 위한 cleanup 전략은?
- Concurrent Mode가 Fiber 아키텍처와 어떤 관련이 있나요?
- SWR 은 데이터의 관점에서, Suspense 는 렌더링 관점에서 비동기 처리를 한거거라고 보면 될까?
