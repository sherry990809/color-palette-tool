const mainColorInput = document.getElementById("mainColor");
const mainColorHex = document.getElementById("mainColorHex");
const colorMap = {
  main: "mainColorBox",
  matching: ["match1", "match2", "match3", "match4"],
  contrast: ["contrast1", "contrast2", "contrast3", "contrast4"]
};

function updateColors(hex) {
  const hexUpper = tinycolor(hex).toHexString().toUpperCase();
  const mainBox = document.getElementById(colorMap.main);
  mainBox.style.backgroundColor = hex;
  mainBox.querySelector("span").innerText = hexUpper;

  const mode = document.getElementById("colorMode").value;
  let matchColors = [];

  if (mode === "analogous") {
    matchColors = [ 
      tinycolor(hex).lighten(10),
      tinycolor(hex).darken(5),
      tinycolor(hex).analogous()[2],
      tinycolor(hex).analogous()[4]
    ];
  } else if (mode === "monochromatic") {
    matchColors = tinycolor(hex).monochromatic().slice(1, 5);
  } else if (mode === "triad") {
    matchColors = tinycolor(hex).triad().slice(1, 5);
  } else if (mode === "tetrad") {
    matchColors = tinycolor(hex).tetrad().slice(1, 5);
  }

  matchColors = matchColors.sort((a, b) => b.getBrightness() - a.getBrightness());
  colorMap.matching.forEach((id, i) => {
    const color = matchColors[i].toHexString();
    const el = document.getElementById(id);
    el.style.backgroundColor = color;
    el.querySelector("span").innerText = color.toUpperCase();
  });

  const baseContrast = tinycolor(hex).complement();
  const contrastColors = [
    baseContrast,
    baseContrast.clone().lighten(15),
    baseContrast.clone().analogous()[5],
    baseContrast.clone().analogous()[4]
  ].sort((a, b) => b.getBrightness() - a.getBrightness());

  colorMap.contrast.forEach((id, i) => {
    const color = contrastColors[i].toHexString();
    const el = document.getElementById(id);
    el.style.backgroundColor = color;
    el.querySelector("span").innerText = color.toUpperCase();
  });

  const preview = document.querySelector(".preview");
  preview.style.backgroundColor = hex;
  preview.querySelector("button").style.backgroundColor = matchColors[0].toHexString();
  preview.querySelector("p").style.color = contrastColors[1].toHexString();
  const textColor = tinycolor(hex).isLight() ? "#000000" : "#FFFFFF";
  preview.querySelector("h2").style.color = textColor;
}

updateColors(mainColorInput.value);

document.querySelectorAll(".color-box").forEach((box) => {
  box.addEventListener("dragstart", (e) => {
    const hex = box.querySelector("span").innerText;
    e.dataTransfer.setData("text/plain", hex);
  });

  box.addEventListener("click", () => {
    const hex = box.querySelector("span").innerText;
    navigator.clipboard.writeText(hex).then(() => {
      box.querySelector("span").innerText = "Copied!";
      setTimeout(() => {
        box.querySelector("span").innerText = hex;
      }, 1000);
    });
  });
});

const preview = document.querySelector(".preview");
preview.addEventListener("dragover", (e) => e.preventDefault());
preview.addEventListener("drop", (e) => {
  e.preventDefault();
  const hex = e.dataTransfer.getData("text/plain");
  preview.querySelector("button").style.backgroundColor = hex;
  preview.querySelector("h2").style.color = tinycolor(hex).isLight() ? "#000" : "#fff";
});

["slot1", "slot2", "slot3", "slot4"].forEach((id) => {
  const slot = document.getElementById(id);
  slot.addEventListener("dragover", (e) => e.preventDefault());
  slot.addEventListener("drop", (e) => {
    e.preventDefault();
    const hex = e.dataTransfer.getData("text/plain");
    slot.style.backgroundColor = hex;
    slot.innerText = hex;
    slot.style.color = tinycolor(hex).isLight() ? "#000" : "#fff";
  });
});

mainColorInput.addEventListener("input", (e) => {
  const hex = e.target.value;
  mainColorHex.value = hex.toUpperCase();
  updateColors(hex);
});

mainColorHex.addEventListener("input", (e) => {
  const val = e.target.value.trim();
  if (/^#([0-9A-Fa-f]{6})$/.test(val)) {
    mainColorInput.value = val;
    updateColors(val);
  }
});

document.getElementById("colorMode").addEventListener("change", () => {
  updateColors(mainColorInput.value);
});


const themePresets = {
  freshPastels: [
    ['#FADADD', '#D0F0C0', '#E3E4FA', '#FFE5B4'],
    ['#B3E5FC', '#FFFACD', '#D8BFD8', '#FFDAB9']
  ],
  y2k: [
    ['#FF00FF', '#00FFFF', '#FFFF00', '#FF6600'],
    ['#66FF66', '#CC00FF', '#00CCFF', '#FFCC00']
  ],
  retro: [
    ['#FF6F61', '#FFD54F', '#8D6E63', '#A1887F'],
    ['#4E342E', '#F4A261', '#E76F51', '#2A9D8F']
  ]
};

document.querySelectorAll('.sidebar li').forEach((item) => {
  item.addEventListener('click', () => {
    const themeName = item.dataset.theme;
    const rows = themePresets[themeName];

    const previewArea = document.querySelector('.theme-examples');
    previewArea.innerHTML = ""; // 清空原本內容

    rows.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.classList.add('theme-row');

      row.forEach(color => {
        const box = document.createElement('div');
        box.classList.add('theme-color');
        box.style.backgroundColor = color;
        rowEl.appendChild(box);
      });

      previewArea.appendChild(rowEl);
    });

    // 滑動到預覽區
    document.getElementById("themePreview").scrollIntoView({ behavior: 'smooth' });
  });
});
