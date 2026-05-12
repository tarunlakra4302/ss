"use client";

import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "@/components/ui/three-d-card";
import { MagicText } from "../../components/ui/magic-text";
import Image from "next/image";
import ButtonWithIcon from "@/components/ui/button-with-icon";

interface ThreeDCardDemoProps {
  title: string;
  location: string;
  date?: string;
  time?: string;
  imageUrl: string;
  linkUrl?: string;
  linkText?: string;
  buttonText?: string;
}

export function ThreeDCardDemo({
  title,
  location,
  date,
  time,
  imageUrl,
  linkUrl = "/contact",
  buttonText = "Sign up"
}: ThreeDCardDemoProps) {
  return (
    <CardContainer className="inter-var w-full" containerClassName="py-4 sm:py-12 w-full">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full max-w-full sm:w-[30rem] min-h-0 sm:min-h-[500px] rounded-lg sm:rounded-xl p-6 border">
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-start w-full gap-4">
            <CardItem
              translateZ="50"
              className="text-neutral-600 dark:text-white flex-1"
            >
              <MagicText text={title} />
            </CardItem>
            {date && (
              <CardItem
                translateZ="80"
                className="text-neutral-900 dark:text-white font-black text-xl leading-none uppercase tracking-tighter whitespace-nowrap pt-1"
              >
                {date}
              </CardItem>
            )}
          </div>
          
          <div className="flex justify-between items-center w-full mt-2">
            <CardItem
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm dark:text-neutral-300 inline-flex items-baseline gap-2"
            >
              <span className="loader"></span>
              <span>{location}</span>
            </CardItem>
            {time && (
              <CardItem
                translateZ="60"
                className="text-neutral-500 text-xs font-medium dark:text-neutral-400 whitespace-nowrap"
              >
                {time}
              </CardItem>
            )}
          </div>
        </div>
        <CardItem translateZ="100" className="w-full mt-4 relative h-48 sm:h-60">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 30rem"
            className="object-cover rounded-xl group-hover/card:shadow-xl"
          />
        </CardItem>
        <div className="flex justify-end items-center mt-4 sm:mt-20">
          <CardItem translateZ={20}>
            <ButtonWithIcon label={buttonText} asChild>
              <Link href={linkUrl} prefetch={false} />
            </ButtonWithIcon>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
