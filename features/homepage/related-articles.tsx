import React from "react";
import { ArticleCardGrid } from "@/components/ui/card-grid";
import TextAnimation1 from "@/components/TextAnimation1";

interface Article {
  id: number;
  imageSrc: string;
  title: string;
  linkText: string;
  linkHref: string;
}

interface RelatedArticlesProps {
  articles: Article[];
}

export const RelatedArticlesSection = ({ articles }: RelatedArticlesProps) => {
  return (
    <div className="w-full relative z-10 py-24 bg-background">
      <div className="w-full flex justify-center px-4 md:px-6 mb-12">
        <TextAnimation1>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-black text-center">
            Make Your Weekend Count.
          </h2>
        </TextAnimation1>
      </div>
      <ArticleCardGrid
        articles={articles}
        className="pt-0"
      />
    </div>
  );
};
