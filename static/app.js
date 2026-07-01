console.log("app.js loaded");

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("inputForm");
    const output = document.getElementById("output");
    const themeSelect = document.getElementById("themeSelect");

    let currentAsciiText = "";

    const themeColors = {
        cyberpunk: ['#00f2fe', '#39ff14', '#fe019a', '#fffb00', '#bc13fe', '#ff073a'],
        hacker: ['#00ff66', '#33ff77', '#00cc52', '#1f803b', '#a3ffa3'],
        vaporwave: ['#ff007f', '#00f2fe', '#9b5de5', '#f15bb5', '#fee440'],
        dracula: ['#ff79c6', '#bd93f9', '#8be9fd', '#50fa7b', '#ffb86c', '#f1fa8c'],
        amber: ['#ffb000', '#ffcc00', '#ff8800', '#ffd700', '#ffaa44']
    };

    function colorizeText(text) {

        const currentTheme = themeSelect.value;
        const colors = themeColors[currentTheme] || themeColors.cyberpunk;

        let html = "";

        for (const line of text.split("\n")) {

            for (const char of line) {

                if (char === "[" || char === "]" || char === "-" || char === "|") {
                    html += char;
                } else {
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    html += `<span style="color:${color}">${char}</span>`;
                }

            }

            html += "<br>";

        }

        return html;
    }

    themeSelect.addEventListener("change", (e) => {

        document.body.className = `theme-${e.target.value}`;

        if (currentAsciiText) {
            output.innerHTML = colorizeText(currentAsciiText);
        }

    });

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const payload = {
            chars: document.getElementById("chars").value,
            charCount: document.getElementById("charCount").value,
            lineCount: document.getElementById("lineCount").value,
            spaceCount: document.getElementById("spaceCount").value,
            characters: document.getElementById("characters").value
        };

        try {

            const response = await fetch("/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            currentAsciiText = result.response;
            output.innerHTML = colorizeText(currentAsciiText);

        } catch (err) {

            console.error(err);
            output.innerText = "Error generating ASCII Art.";

        }

    });

    document.getElementById("copyBtn").addEventListener("click", async () => {

        if (!currentAsciiText) return;

        await navigator.clipboard.writeText(currentAsciiText);

    });

    document.getElementById("saveBtn").addEventListener("click", async () => {

        if (!currentAsciiText) return;

        output.classList.add("exporting");

        const canvas = await html2canvas(output, {
            scale: 4,
            backgroundColor: getComputedStyle(output).backgroundColor
        });

        output.classList.remove("exporting");

        const link = document.createElement("a");
        link.download = "ascii-art.png";
        link.href = canvas.toDataURL("image/png");
        link.click();

    });

});