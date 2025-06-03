# my-react

> Make my own React library

- typescript 가 아닌 tsc 사용 해야함

```sh
npx tsc --init
```

# D1

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
