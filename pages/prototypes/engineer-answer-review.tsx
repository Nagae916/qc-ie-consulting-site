import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { EngineerAnswerReviewPrototype } from "@/components/prototypes/EngineerAnswerReviewPrototype";
import { SiteMeta } from "@/components/site/SiteMeta";

type PrototypeVariant = "a" | "b" | "c";

type PrototypePageProps = {
  variant: PrototypeVariant;
};

export const getServerSideProps: GetServerSideProps<PrototypePageProps> = async ({ query }) => ({
  props: {
    variant: query.variant === "b" || query.variant === "c" ? query.variant : "a",
  },
});

export default function EngineerAnswerReviewPrototypePage({
  variant,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const label = variant === "a" ? "Editorial Lab" : variant === "b" ? "Guided Workbook" : "Editorial Lab A+";

  return (
    <>
      <SiteMeta
        title={`Ⅱ-1-4 デザイン比較 ${label}`}
        description="技術士Ⅱ-1-4復元答案レビューの教育コンテンツ用デザイン比較です。"
        path="/guides/engineer/2026-ii-1-4-answer-review"
        noIndex
      />
      <EngineerAnswerReviewPrototype variant={variant} />
    </>
  );
}
