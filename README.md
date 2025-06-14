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
