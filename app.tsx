// This will our main app file.
//
// ---- Library ---
const resourceCache = {};
const createResource = (asyncTask, key) => {
  // First check if the key is present in the cache.
  // if so simply return the cached value.
  if (resourceCache[key]) return resourceCache[key];
  // If not
  throw { promise: asyncTask(), key };
};

const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      try {
        return tag(props, ...children);
      } catch ({ promise, key }) {
        // Handle when this promise is resolved/rejected.
        promise.then((value) => {
          resourceCache[key] = value;
          reRender();
        });
        // We branch off the VirtualDOM here
        // now this will be immediately be rendered.
        return { tag: "h2", props: null, children: ["loading your image"] };
      }
    }
    const el = {
      tag,
      props,
      children,
    };
    console.log(el);

    return el;
  },
};
const render = (el, container) => {
  let domEl;
  // 0. Check the type of el
  //    if string we need to handle it like text node.
  if (typeof el === "string") {
    // create an actual Text Node
    domEl = document.createTextNode(el);
    container.appendChild(domEl);
    // No children for text so we return.
    return;
  }
  // 1. First create the document node corresponding el
  domEl = document.createElement(el.tag);
  // 2. Set the props on domEl
  let elProps = el.props ? Object.keys(el.props) : null;
  if (elProps && elProps.length > 0) {
    elProps.forEach((prop) => (domEl[prop] = el.props[prop]));
  }
  // 3. Handle creating the Children.
  if (el.children && el.children.length > 0) {
    // When child is rendered, the container will be
    // the domEl we created here.
    el.children.forEach((node) => render(node, domEl));
  }
  // 4. append the DOM node to the container.
  container.appendChild(domEl);
};

const myAppState = [];
let myAppStateCursor = 0;
const useState = (initialState) => {
  // get the cursor for this useState
  const stateCursor = myAppStateCursor;
  // Check before setting AppState to initialState (reRender)
  myAppState[stateCursor] = myAppState[stateCursor] || initialState;
  console.log(
    `useState is initialized at cursor ${stateCursor} with value:`,
    myAppState,
  );
  const setState = (newState) => {
    console.log(
      `setState is called at cursor ${stateCursor} with newState value:`,
      newState,
    );
    myAppState[stateCursor] = newState;
    // Render the UI fresh given state has changed.
    reRender();
  };
  // prepare the cursor for the next state.
  myAppStateCursor++;
  console.log(`stateDump`, myAppState);
  return [myAppState[stateCursor], setState];
};

const reRender = () => {
  console.log("reRender-ing :)");
  const rootNode = document.getElementById("myapp");
  // reset/clean whatever is rendered already
  rootNode.innerHTML = "";
  // Reset the global state cursor
  myAppStateCursor = 0;
  // then render Fresh
  render(<App />, rootNode);
};

// ---- Remote API ---- //
const photoURL = "https://picsum.photos/200";
const getMyAwesomePic = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(photoURL), 1500);
  });
};

// ---- Application ---
const App = () => {
  const [name, setName] = useState("Arindam");
  const [count, setCount] = useState(0);
  const photo = createResource(getMyAwesomePic, "photo");
  return (
    <div draggable>
      <h2>Hello {name}!</h2>
      <p>I am a pargraph</p>
      <input
        type="text"
        value={name}
        onchange={(e) => setName(e.target.value)}
      />
      <h2> Counter value: {count + ""}</h2>
      <button onclick={() => setCount(count + 1)}>+1</button>
      <button onclick={() => setCount(count - 1)}>-1</button>
      <img src={photo} alt="Photo" />
    </div>
  );
};

render(<App />, document.getElementById("myapp"));
