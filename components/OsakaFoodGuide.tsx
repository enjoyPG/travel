import type { TripFoodGuide } from "@/data/trip-types";
import { ReadableText } from "@/components/ReadableText";

export function OsakaFoodGuide({ guide }: { guide: TripFoodGuide }) {
  let dishNumber = 0;

  return <section className="osaka-food-guide" aria-labelledby="food-guide-title">
    <header className="food-guide-heading">
      <span className="section-index">OSAKA · FOOD CULTURE · 21 PICKS</span>
      <h2 id="food-guide-title">{guide.title}</h2>
      <ReadableText text={guide.intro} className="food-guide-intro-copy" />
    </header>
    <div className="food-guide-categories">
      {guide.categories.map((category, categoryIndex) => <section className="food-guide-category" key={`${category.title}-${categoryIndex}`}>
        <div className="food-category-heading"><span>{String(categoryIndex + 1).padStart(2, "0")}</span><div><h3>{category.title}</h3><ReadableText text={category.intro} className="food-category-copy" /></div></div>
        <div className="food-dish-grid">
          {category.dishes.map((dish, dishIndex) => {
            dishNumber += 1;
            return <article className="food-dish-card" key={`${dish.name}-${dishIndex}`}>
              <span className="food-dish-number">{String(dishNumber).padStart(2, "0")}</span>
              <div className="food-dish-title"><h4>{dish.name}</h4><span lang="ja">{dish.japanese}</span></div>
              <ReadableText text={dish.description} className="food-dish-copy" />
            </article>;
          })}
        </div>
      </section>)}
    </div>
    {guide.links.length > 0 && <footer className="food-guide-sources"><strong>더 읽어보기</strong><div>{guide.links.filter((link) => link.label.trim() && link.url.startsWith("https://")).map((link, index) => <a href={link.url} target="_blank" rel="noreferrer" key={`${link.url}-${index}`}>{link.label} <span aria-hidden="true">↗</span></a>)}</div></footer>}
  </section>;
}
