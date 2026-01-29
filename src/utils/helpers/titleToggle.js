export default function updateTitle(title) {
  const currentTitle = document.title;
  const newTitle = currentTitle + `|${title}`;
  document.title = newTitle;
  console.log("title");
}
