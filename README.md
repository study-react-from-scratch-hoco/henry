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
