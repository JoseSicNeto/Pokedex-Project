async function loadLayout() {
  const res = await fetch("layout.html");
  const html = await res.text();
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Adiciona o header e footer
  document.getElementById("header").replaceWith(tempDiv.querySelector("header"));
  document.getElementById("footer").replaceWith(tempDiv.querySelector("footer"));


  // Adiciona o favicon no head
  if (!document.querySelector('link[rel="icon"]')) {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = "assets/images/Logo_Pokebola.png";
    document.head.appendChild(link);
  }
}

loadLayout();
