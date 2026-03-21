const SVG_ASSET_PATHS = {
  storyCard: "./src/assets/ui/textBox.svg",
  answer: "./src/assets/ui/etichetta-ghirigori.svg",
  cta: "./src/assets/ui/pulsante-marrone.svg",
};

const decorateSvg = (svgMarkup, className) =>
  svgMarkup.replace(
    /<svg\b/,
    `<svg class="${className}" aria-hidden="true" focusable="false" preserveAspectRatio="none"`
  );

export async function loadUiSvgAssets() {
  const entries = await Promise.all(
    Object.entries(SVG_ASSET_PATHS).map(async ([key, path]) => {
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(`Impossibile caricare l'asset SVG: ${path}`);
      }

      return [key, await response.text()];
    })
  );

  const assets = Object.fromEntries(entries);

  return {
    storyCardFrame: decorateSvg(assets.storyCard, "story-card__frame"),
    answerFrame: decorateSvg(assets.answer, "quiz-answer__frame"),
    ctaFrame: decorateSvg(assets.cta, "quiz-cta__frame"),
  };
}
