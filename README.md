# my-react

> Let’s build a React from scratch

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

- <div id="myapp"></div> 을 virtual DOM 의 root node 로 잡고 실제 DOM 을 렌더링한다

1. 해당 type의 실제 DOM node 생성
2. props 복제
3. children 존재하는 경우 1~2 를 반복하여 현재 DOM 하위로 append
4. container.appendChild(domEl) 으로 브라우저 container 에 추가
5. Text node 의 경우 별도 처리 필요

## Lessons Learned

- 리액트 처음 배울때는 초고수들만 직접 만들기 하는줄 알아서 겁먹었는데 생각 보다 간단하다.
- 사실 JSX 가 너무 많은걸 해주는 것 같다. JSX 직접 만들기도 도전?
- virtual DOM 의 한계에 대한 글들이 요즘 많이 보이는데, signal 기반도 직접 만들기 해보면 좋을 것 같다
