/* note: I encountered errors when trying to serve main.js after
it was created using echo "" > main.js. I fixed this by pasting
the content of the file into a new main.js file created using
my GUI. */
import "../style.css";

const app = document.getElementById("app");
app.innerHTML = `<div class="flex items-center justify-center h-screen">
  <div>Hello World!</div>
</div>`;
