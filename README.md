# GMO Interactive Lab

A short Science Day demo that connects a 3D DNA model to a simple crop model. Built with HTML, CSS, JavaScript, Three.js, Chart.js, and Vite.

## Start

1. Extract the project folder.
2. Double-click **Start GMO Lab.bat**. It installs dependencies if needed, starts the site, and opens the browser.
3. Keep the terminal window open. Press **Ctrl+C** in it to stop the site.

Or open the folder in VS Code, run `npm install` once in the terminal, then `npm run dev`. Open the local URL shown in the terminal. Do not open `index.html` directly.

## Quick tour

1. Open **DNA & Crop Lab** and rotate the helix.
2. Select **Insect defense**, **Water saving**, or **Extra nutrition**. Its marker, selected-feature label, and crop score update together.
3. Adjust insect risk, water available, and trait effect; all three update every feature’s example score.
4. Turn on **Exhibition mode** for larger text and fullscreen. Press **Esc** to exit.

5. Open **Examples** for real crop examples and a plain-language explanation of the model. Open **Sources** for the references.

The colored marker is a teaching visual. Real DNA changes are more complex. Scores are made-up examples, not real harvest results, nutrient measurements, or yield predictions. **Reset demo** restores the default settings and feature.

## Internet access

The interactive demo runs on your computer. After its packages have been installed, it does not need internet access to run. The links on **Sources** open external reference pages and do need internet. If you are setting the project up on a new computer, installing its packages needs an internet connection once.

## Publish on GitHub Pages

The included GitHub Actions workflow builds and publishes the site whenever changes are pushed to `main`. In the repository settings, choose **Settings → Pages → Build and deployment → GitHub Actions** as the source. The deployed site is publicly viewable so it can be opened by someone who does not have a GitHub account.
