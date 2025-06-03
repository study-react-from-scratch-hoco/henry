// This will our main app file.
//
// ---- Library ---
const React = {
  createElement: (...args) => {
    console.log(args);
  },
};
// ---- Application ---
const App = (
  <div draggable>
    <h2>Hello React!</h2>
    <p>I am a pargraph</p>
    <input type="text" />
  </div>
);
